const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  category: {
    type: String,
  },
  clientName: {
    type: String,
    required: false,
  },
  description: {
    type: String,
  },
  url: {
    type: [String],
  },
  stars: {
    type: Number,
  },
  images: {
    type: [String],
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
