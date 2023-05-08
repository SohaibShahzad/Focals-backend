const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["ongoing", "completed"],
    default: "ongoing",
  },
  progress: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
});

const userProjectsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ongoingProjects: [projectSchema],
    projectHistory: [projectSchema],
  },
  {
    timestamps: true,
  }
);

const UserProjects = mongoose.model("UserProjects", userProjectsSchema);

module.exports = UserProjects;
