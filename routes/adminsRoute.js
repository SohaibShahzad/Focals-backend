const express = require("express");
const router = express.Router();
const {
  getAllAdmins,
  getAdminbyId,
  addNewAdmin,
  deleteAdmin,
  updateAdminById,
  verifyAdmin,
  adminLogout,
} = require("../controller/adminsController");

router.get("/getAllAdmins", getAllAdmins);
router.get("/getAdminbyId/:id", getAdminbyId);
router.post("/addNewAdmin", addNewAdmin);
router.delete("/deleteAdmin/:id", deleteAdmin);
router.delete("/adminLogout", adminLogout);
router.post("/verifyAdmin", verifyAdmin);
router.put("/updateAdminById/:id", updateAdminById);

module.exports = router;
