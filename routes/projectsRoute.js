const express = require("express");
const router = express.Router();

const {
  addNewProject,
  getAllProjects,
  getTotalProjectsCount,
  getOngoingProjectsCountByUser,
  getProjectsByUser,
  updateProject,
} = require("../controller/projectsController");

router.post("/addNewProject", addNewProject);
router.get("/getTotalProjectsCount", getTotalProjectsCount);
router.get("/getAllProjects", getAllProjects);
router.get("/getOngoingProjectsCountByUser/:id", getOngoingProjectsCountByUser);
router.get("/getProjectsByUser/:id", getProjectsByUser);
router.put("/updateProject/:userId/:projectId", updateProject);


module.exports = router;
