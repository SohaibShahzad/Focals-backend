const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getAllUsers,
  addNewUser,
  userLogout,
  verifyUser,
  deleteUser,
} = require("../controller/usersController");

router.get("/getAllUsers", getAllUsers);
router.post("/addNewUser", addNewUser);
router.delete("/deleteUser/:id", deleteUser);
router.delete("/userLogout", userLogout);
router.post("/verifyUser", verifyUser);

module.exports = router;
