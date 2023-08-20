const UserProjects = require("../models/projectsModel");
const User = require("../models/usersModel"); // <-- Add this
const Message = require("../models/messageModel"); // <-- Add this

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await UserProjects.find({});
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

const getProjectsByUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const projects = await UserProjects.findOne({ user: userId });
    if (projects) {
      // If a projects document was found, return it
      res.status(200).json(projects);
    } else {
      // If no projects document was found, return an error message
      res.status(404).json({ message: "No projects found for this user" });
    }
  } catch (error) {
    next(error);
  }
};

const getTotalProjectsCount = async (req, res, next) => {
  try {
    const projects = await UserProjects.find({});
    const totalOngoingProjects = projects.reduce((acc, project) => {
      return acc + project.ongoingProjects.length;
    }, 0);
    const totalCompletedProjects = projects.reduce((acc, project) => {
      return acc + project.projectHistory.length;
    }, 0);
    res.status(200).json({ totalOngoingProjects, totalCompletedProjects });
  } catch (error) {
    next(error);
  }
};

const getOngoingProjectsCountByUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userProjects = await UserProjects.findOne({ user: userId });
    const ongoingCount = userProjects ? userProjects.ongoingProjects.length : 0;
    const completedCount = userProjects
      ? userProjects.projectHistory.length
      : 0;
    res.status(200).json({
      ongoingProjectsCount: ongoingCount,
      completedProjectsCount: completedCount,
    });
  } catch (error) {
    next(error);
  }
};

const getTotalRevenue = async (req, res, next) => {
  try {
    const projects = await UserProjects.find({});
    const totalRevenue = projects.reduce((acc, project) => {
      return (
        acc +
        project.projectHistory.reduce((acc, project) => {
          return acc + project.price;
        }, 0)
      );
    }, 0);
    res.status(200).json({ totalRevenue });
  } catch (error) {
    next(error);
  }
};

const addNewProject = async (req, res, next) => {
  console.log("req.body: ", req.body);
  try {
    const {
      email,
      projectName,
      // description,
      // startDate,
      // endDate,
      // status,
      // progress,
      price,
    } = req.body;

    const newProject = {
      projectName,
      description: "",
      startDate: null, // set startDate as null
      endDate: null, // set endDate as null
      status: "Scheduled",
      progress: 0,
      price,
      meetingStatus: "Scheduled",
    };

    // Find the user by email
    const user = await User.findOne({ username: email }); // Assuming username is the email
    if (user) {
      console.log("User found: ", user);
    } else {
      console.log("User not found");
    }
    // Find the user's projects by email
    let userProjects = await UserProjects.findOne({ email: email });

    if (!userProjects) {
      // If no projects are found for this user, create a new document
      // Include the user's id if the user exists
      userProjects = new UserProjects({
        email: email,
        user: user ? user._id : null,
      });
    }

    // Add the new project to the ongoingProjects array
    userProjects.ongoingProjects.push(newProject);

    // Save the updated document
    await userProjects.save();

    res.status(201).json(userProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;

    const userProjects = await UserProjects.findOne({ user: userId });
    const updatedOngoingProjects = userProjects.ongoingProjects.filter(
      (project) => project._id.toString() !== projectId
    );

    userProjects.ongoingProjects = updatedOngoingProjects;
    await userProjects.save();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const updateProject = async (req, res, next) => {
  const updateData = req.body;
  console.log("updateData: ", updateData);
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;

    const userProjects = await UserProjects.findOne({ user: userId });

    const projectIndex = userProjects.ongoingProjects.findIndex(
      (project) => project._id.toString() === projectId
    );

    if (projectIndex === -1) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const updatedProject = {
      ...userProjects.ongoingProjects[projectIndex]._doc,
      ...updateData,
    };

    if (updatedProject.status === "Completed") {
      userProjects.projectHistory.push(updatedProject);
      userProjects.ongoingProjects.pull({ _id: updatedProject._id });
    }

    console.log("updatedProject: ", userProjects);

    await userProjects.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllProjects,
  getTotalProjectsCount,
  getOngoingProjectsCountByUser,
  getProjectsByUser,
  addNewProject,
  deleteProject,
  updateProject,
};
