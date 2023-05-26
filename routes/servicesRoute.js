const express = require("express");
const {
  getAllServices,
  getAllServicesWithoutImages,
  getServiceDataAndImages,
  addNewServiceWithImages,
  deleteService,
  updateServiceById,
  parser,
} = require("../controller/servicesController");
const router = express.Router();

router.get("/getAllServices", getAllServices);
router.get("/getAllServicesWithoutImages", getAllServicesWithoutImages);
router.get("/getServiceDataAndImages/:id", getServiceDataAndImages);
router.post("/addNewServiceWithImages", parser.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images", maxCount: 10 }]), addNewServiceWithImages);
router.delete("/deleteService/:id", deleteService);
router.put("/updateServiceById/:id", parser.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images", maxCount: 10 }]), updateServiceById);

module.exports = router;
