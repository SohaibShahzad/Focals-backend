const express = require("express");
const {
  getAllServices,
  getCategories,
  getTotalServicesCount,
  getAllServiceTitles,
  getAllServicesWithoutImages,
  getServiceDataAndImages,
  addNewServiceWithImages,
  deleteService,
  updateServiceById,
  getServicesTitle,
  getServicesWithThumbs,
  parser,
} = require("../controller/servicesController");
const router = express.Router();

router.get("/getAllServices", getAllServices);
router.get("/getServicesWithThumbs", getServicesWithThumbs);
router.get("/getCategories", getCategories);
router.get("/getServicesTitle",getServicesTitle)
router.get("/getTotalServicesCount", getTotalServicesCount);
router.get("/getAllServiceTitles", getAllServiceTitles);
router.get("/getAllServicesWithoutImages", getAllServicesWithoutImages);
router.get("/getServiceDataAndImages/:id", getServiceDataAndImages);
router.post("/addNewServiceWithImages", parser.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images", maxCount: 10 }]), addNewServiceWithImages);
router.delete("/deleteService/:id", deleteService);
router.put("/updateServiceById/:id", parser.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images", maxCount: 10 }]), updateServiceById);

module.exports = router;
