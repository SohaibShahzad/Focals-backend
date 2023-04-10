const express = require("express");
const {
  getAllServices,
  getAllServiceIds,
  getServiceById,
  addNewService,
  deleteService,
  updateServiceById
} = require("../controller/servicesController");
const router = express.Router();

router.get("/getAllServices", getAllServices);
router.get("/getAllServiceIds", getAllServiceIds);
router.get("/getServiceById/:id", getServiceById);
router.post("/addNewService", addNewService);
router.delete("/deleteService/:id", deleteService);
router.put("/updateServiceById/:id", updateServiceById);

module.exports = router;
