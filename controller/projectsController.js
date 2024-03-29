const UserProjects = require("../models/projectsModel");
const Notification = require("../models/notificationModel");
const { getIO } = require("../utils/io");
const User = require("../models/usersModel"); // <-- Add this
const Message = require("../models/messageModel"); // <-- Add this
const { v4: uuidv4 } = require("uuid");

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
      res.status(200).json(projects);
    } else {
      res.status(204).json({ message: "No projects found for this user" });
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
    const totalScheduledProjects = projects.reduce((acc, project) => {
      return acc + project.scheduledProjects.length;
    }, 0);
    const totalRevisionProjects = projects.reduce((acc, project) => {
      return acc + project.revisionProjects.length;
    }, 0);
    const totalAwaitingApprovalProjects = projects.reduce((acc, project) => {
      return acc + project.awaitingApprovalProjects.length;
    }, 0);
    const totalCancelledProjects = projects.reduce((acc, project) => {
      return acc + project.cancelledProjects.length;
    }, 0);

    res.status(200).json({
      totalOngoingProjects,
      totalCompletedProjects,
      totalScheduledProjects,
      totalRevisionProjects,
      totalAwaitingApprovalProjects,
      totalCancelledProjects,
    });
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
    const scheduledCount = userProjects
      ? userProjects.scheduledProjects.length
      : 0;
    const revisionCount = userProjects
      ? userProjects.revisionProjects.length
      : 0;
    const awaitingApprovalCount = userProjects
      ? userProjects.awaitingApprovalProjects.length
      : 0;
    const cancelledCount = userProjects
      ? userProjects.cancelledProjects.length
      : 0;

    res.status(200).json({
      ongoingProjectsCount: ongoingCount,
      completedProjectsCount: completedCount,
      scheduledProjectsCount: scheduledCount,
      revisionProjectsCount: revisionCount,
      awaitingApprovalProjectsCount: awaitingApprovalCount,
      cancelledProjectsCount: cancelledCount,
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
    const { email, projectName, startDate, price } = req.body;

    const newProject = {
      chatId: uuidv4(),
      projectName,
      description: "",
      startDate,
      endDate: null, // set endDate as null
      status: "Scheduled",
      progress: 0,
      paymentStatus: "Paid",
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

    const exisitngUserProjects = await UserProjects.findOne({ user: user._id });

    if (exisitngUserProjects) {
      exisitngUserProjects.scheduledProjects.push(newProject);
      await exisitngUserProjects.save();

      res.status(201).json(exisitngUserProjects);
    } else {
      userProjects = new UserProjects({
        email: email,
        user: user ? user._id : null,
        userName: user ? user.firstName : null,
        scheduledProjects: [newProject],
      });

      await userProjects.save();

      res.status(201).json(userProjects);
    }
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
    if (!userProjects) {
      return res.status(404).json({ message: "User's projects not found" });
    }

    let projectToUpdate = null;
    let sourceArrayName = "";

    const arrays = [
      "ongoingProjects",
      "scheduledProjects",
      "revisionProjects",
      "awaitingApprovalProjects",
      "cancelledProjects",
      "projectHistory",
    ];

    for (const arrayName of arrays) {
      const foundProject = userProjects[arrayName].id(projectId);
      if (foundProject) {
        projectToUpdate = foundProject;
        sourceArrayName = arrayName;
        break;
      }
    }

    if (!projectToUpdate) {
      return res.status(404).json({ message: "Project not found" });
    }

    const changes = [];
    for (const [key, value] of Object.entries(updateData)) {
      if (
        (key === "startDate" || key === "endDate") &&
        projectToUpdate[key] &&
        value
      ) {
        const originalDate = new Date(projectToUpdate[key]).toISOString();
        const newDate = new Date(value).toISOString();
        if (originalDate !== newDate) {
          changes.push({
            field: key,
            oldValue: originalDate,
            newValue: newDate,
          });
        }
      } else if (projectToUpdate[key] !== value) {
        changes.push({
          field: key,
          oldValue: projectToUpdate[key],
          newValue: value,
        });
      }
    }

    for (const [key, value] of Object.entries(updateData)) {
      if (key === "startDate" || key === "endDate") {
        projectToUpdate[key] = new Date(value).toISOString();
      } else {
        projectToUpdate[key] = value;
      }
    }

    if (projectToUpdate.status !== updateData.status) {
      projectToUpdate.createdAt = new Date().toISOString();
    }

    let targetArrayName = sourceArrayName;

    switch (updateData.status) {
      case "Scheduled":
        targetArrayName = "scheduledProjects";
        break;
      case "In Progress":
        targetArrayName = "ongoingProjects";
        break;
      case "Revision":
        targetArrayName = "revisionProjects";
        break;
      case "Awaiting Approval":
        targetArrayName = "awaitingApprovalProjects";
        break;
      case "Cancelled":
        targetArrayName = "cancelledProjects";
        break;
      case "Completed":
        targetArrayName = "projectHistory";
        break;
    }

    if (sourceArrayName !== targetArrayName) {
      userProjects[sourceArrayName].pull(projectToUpdate);
      userProjects[targetArrayName].push(projectToUpdate);
    }

    await userProjects.save();
    let notification = null;

    if (changes.length > 0) {
      let detailedMessage = `Your project "${
        projectToUpdate.projectName
      }" has been updated on ${new Date().toLocaleString()}. Changes: `;
      changes.forEach((change) => {
        detailedMessage += `${change.field} from "${change.oldValue}" to "${change.newValue}", `;
      });
      detailedMessage = detailedMessage.slice(0, -2) + ".";

      notification = new Notification({
        user: userId,
        title: projectToUpdate.projectName,
        message: detailedMessage,
        changes: changes,
        projectId: projectId,
      });

      await notification.save();
    }

    res.status(200).json({
      message: "Project updated successfully",
      project: userProjects,
      notification: notification,
    });
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
