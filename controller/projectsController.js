const UserProjects = require("../models/projectsModel");

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
    const userId = req.url.toString().split("/");
    const projects = await UserProjects.find({ user: userId[2] });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

const addNewProject = async (req, res, next) => {
  try {
    const userId = req.url.toString().split("/");
    const {
      projectName,
      description,
      startDate,
      endDate,
      status,
      progress,
      price,
    } = req.body;

    const newProject = {
      projectName,
      description,
      startDate,
      endDate,
      status,
      progress,
      price,
    };

    const updatedUserProjects = await UserProjects.findByIdAndUpdate(
      userId[2],
      { $push: { ongoingProjects: newProject } },
      { new: true, upsert: true }
    );

    res.status(201).json(updatedUserProjects);
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

    if (updatedProject.status === "completed") {
      userProjects.projectHistory.push(updatedProject);
      userProjects.ongoingProjects.splice(projectIndex, 1);
    } else {
      userProjects.ongoingProjects[projectIndex] = updatedProject;
    }

    await userProjects.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllProjects,
  getProjectsByUser,
  addNewProject,
  deleteProject,
  updateProject,
};
