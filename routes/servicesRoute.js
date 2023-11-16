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
  upload, // Import the updated upload middleware
} = require("../controller/servicesController");

const router = express.Router();

router.get("/getAllServices", getAllServices);
router.get("/getServicesWithThumbs", getServicesWithThumbs);
router.get("/getCategories", getCategories);
router.get("/getServicesTitle", getServicesTitle);
router.get("/getTotalServicesCount", getTotalServicesCount);
router.get("/getAllServiceTitles", getAllServiceTitles);
router.get("/getAllServicesWithoutImages", getAllServicesWithoutImages);
router.get("/getServiceDataAndImages/:id", getServiceDataAndImages);

// Update these routes to use the correct upload middleware
router.post(
  "/addNewServiceWithImages",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  addNewServiceWithImages
);
router.put(
  "/updateServiceById/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateServiceById
);

router.delete("/deleteService/:id", deleteService);

module.exports = router;
