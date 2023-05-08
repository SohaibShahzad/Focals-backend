const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getAllUsers,
  verifyOTPandRegister,
  userLogout,
  verifyUser,
  deleteUser,
  otpEmail,
} = require("../controller/usersController");

router.get("/getAllUsers", getAllUsers);
router.post("/verifyOTPandRegister", verifyOTPandRegister);
router.delete("/deleteUser/:id", deleteUser);
router.delete("/userLogout", userLogout);
router.post("/verifyUser", verifyUser);
router.post("/otpEmail", otpEmail);

module.exports = router;
