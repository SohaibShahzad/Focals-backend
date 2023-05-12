const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  features: { type: [String], required: true },
});

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: false },
  images: [{ type: String, required: false }],
  description: { type: String, required: true },
  packages: [packageSchema],
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
