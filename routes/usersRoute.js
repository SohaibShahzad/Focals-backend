const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserbyId,
  getTotalUsersCount,
  verifyOTPandRegister,
  userLogout,
  verifyUser,
  deleteUser,
  otpEmail,
  resetPasswordRequest,
  verifyOTPforReset,
  resetPassword,
} = require("../controller/usersController");

router.get("/getAllUsers", getAllUsers);
router.get("/getTotalUsersCount", getTotalUsersCount);
router.get("/getUserbyId/:id", getUserbyId);
router.post("/verifyOTPandRegister", verifyOTPandRegister);
router.delete("/deleteUser/:id", deleteUser);
router.delete("/userLogout", userLogout);
router.post("/verifyUser", verifyUser);
router.post("/otpEmail", otpEmail);
router.post("/resetPasswordRequest", resetPasswordRequest);
router.post("/verifyOTPforReset", verifyOTPforReset);
router.post("/resetPassword", resetPassword);

module.exports = router;
