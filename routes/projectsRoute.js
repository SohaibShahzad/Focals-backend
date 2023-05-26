const express = require("express");
const router = express.Router();

const {
  addNewProject,
  getProjectsByUser,
} = require("../controller/projectsController");

router.post("/addNewProject", addNewProject);
router.get("/getProjectsByUser/:id", getProjectsByUser);


module.exports = router;
