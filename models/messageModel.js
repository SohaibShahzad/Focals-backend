const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // will add createdAt and updatedAt fields automatically
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
