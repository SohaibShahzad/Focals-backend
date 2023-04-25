const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getAllAdmins,
  addNewAdmin,
  deleteAdmin,
  updateAdminById,
  verifyAdmin,
  adminLogout
} = require("../controller/adminsController");

router.get("/getAllAdmins", getAllAdmins);
router.post("/addNewAdmin", addNewAdmin);
router.delete("/deleteAdmin/:id", deleteAdmin);
router.delete("/adminLogout", adminLogout);
router.post("/verifyAdmin", verifyAdmin);
router.put("/updateAdminById/:id", updateAdminById);

module.exports = router;
