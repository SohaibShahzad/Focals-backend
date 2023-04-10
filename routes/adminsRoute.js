const express = require("express");
const router = express.Router();
const {
  getAllAdmins,
  addNewAdmin,
  deleteAdmin,
  updateAdminById,
  verifyAdmin,
} = require("../controller/adminsController");

router.get("/getAllAdmins", getAllAdmins);
router.post("/addNewAdmin", addNewAdmin);
router.delete("/deleteAdmin/:id", deleteAdmin);
router.post("/verifyAdmin", verifyAdmin);
router.put("/updateAdminById/:id", updateAdminById);

module.exports = router;
