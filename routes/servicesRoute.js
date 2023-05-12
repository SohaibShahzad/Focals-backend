const express = require("express");
const {
  getAllServices,
  getServiceDataAndImages,
  addNewServiceWithImages,
  deleteService,
  updateServiceById,
  parser,
} = require("../controller/servicesController");
const router = express.Router();

router.get("/getAllServices", getAllServices);
router.get("/getServiceDataAndImages/:id", getServiceDataAndImages);
router.post("/addNewServiceWithImages", parser.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images", maxCount: 10 }]), addNewServiceWithImages);
router.delete("/deleteService/:id", deleteService);
router.put("/updateServiceById/:id", updateServiceById);

module.exports = router;
