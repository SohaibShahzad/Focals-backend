const express = require("express");
const router = express.Router();

const {
  getAllSubAdmins,
  getSubAdminbyId,
  getTotalSubAdmins,
  getSubAdminByPermissions,
  addNewSubAdmin,
  deleteSubAdmin,
  updateSubAdminById,
  verifySubAdmin,
  subAdminLogout,
} = require("../controller/subAdminsController");

router.get("/getAllSubAdmins", getAllSubAdmins);
router.get("/getTotalSubAdmins", getTotalSubAdmins);
router.get("/getSubAdminbyId/:id", getSubAdminbyId);
router.get("/getSubAdminByPermissions/:permissions", getSubAdminByPermissions);
router.post("/addNewSubAdmin", addNewSubAdmin);
router.delete("/deleteSubAdmin/:id", deleteSubAdmin);
router.delete("/subAdminLogout", subAdminLogout);
router.post("/verifySubAdmin", verifySubAdmin);
router.put("/updateSubAdminById/:id", updateSubAdminById);

module.exports = router;
