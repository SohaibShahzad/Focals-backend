const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    testimonialHeading: {
        type: String,
    },
    testimonialData: {
        type: String,
    },
    stars: {
        type: Number,
    },
})

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;