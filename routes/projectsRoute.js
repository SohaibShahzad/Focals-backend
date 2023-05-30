const express = require("express");
const router = express.Router();

const {
  addNewProject,
  getAllProjects,
  getProjectsByUser,
} = require("../controller/projectsController");

router.post("/addNewProject", addNewProject);
router.get("/getAllProjects", getAllProjects);
router.get("/getProjectsByUser/:id", getProjectsByUser);


module.exports = router;
