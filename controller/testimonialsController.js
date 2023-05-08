const Testimonial = require("../models/testimonialModel");

const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({});
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

const addNewTestimonial = async (req, res, next) => {
  const { name, testimonialHeading, testimonialData, stars } = req.body;
  const parsedTestimonial = {
    name,
    testimonialHeading,
    testimonialData,
    stars,
  };
  const newTestimonial = new Testimonial(parsedTestimonial);
  try {
    const savedTestimonial = await newTestimonial.save();
    res.status(200).json({
      message: `Testimonial Saved and the obj is ${savedTestimonial}`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonialId = req.url.toString().split("/");
    const deletedTestimonial = await Testimonial.findByIdAndDelete(
      testimonialId[2]
    );
    res.json(deletedTestimonial);
  } catch (error) {
    next(error);
  }
};

const updateTestimonialById = async (req, res, next) => {
  const { name, testimonialHeading, testimonialData, stars } = req.body;
  const parsedTestimonial = {
    name,
    testimonialHeading,
    testimonialData,
    stars,
  };
  try {
    const testimonialId = req.url.toString().split("/");
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      testimonialId[2],
      parsedTestimonial
    );
    res.json(updatedTestimonial);
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getAllTestimonials,
    addNewTestimonial,
    deleteTestimonial,
    updateTestimonialById
}
