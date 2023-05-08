const express = require("express");
const router = express.Router();

const {
    getAllTestimonials,
    addNewTestimonial,
    deleteTestimonial,
    updateTestimonialById
} = require("../controller/testimonialsController");

router.get("/getAllTestimonials", getAllTestimonials);
router.post("/addNewTestimonial", addNewTestimonial);
router.delete("/deleteTestimonial/:id", deleteTestimonial);
router.put("/updateTestimonialById/:id", updateTestimonialById);

module.exports = router;