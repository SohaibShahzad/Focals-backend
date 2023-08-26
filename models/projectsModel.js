const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  chatId: {
    type: String,
    index: { unique: false },
  },
  projectName: {
    type: String,
    required: true,
  },
  // description: {
  //   type: String,
  // },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: [
      "Scheduled",
      "In Progress",
      "Revision",
      "Awaiting Approval",
      "Completed",
    ],
    default: "Scheduled",
  },
  progress: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    // enum: ["Unpaid", "aid"],
    default: "Unpaid",
  },
  meetingStatus: {
    type: String,
    enum: ["Not scheduled", "Scheduled"],
    default: "Not scheduled",
  },
});

const userProjectsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
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
