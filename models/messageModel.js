const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // will add createdAt and updatedAt for each message
  }
);

const chatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    messages: [messageSchema], // An array of message documents
  },
  {
    timestamps: true, // will add createdAt and updatedAt for each chat document
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
