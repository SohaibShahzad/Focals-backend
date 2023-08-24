const mongoose = require("mongoose");

const userChatSchema = new mongoose.Schema(
  {
    chatId: String,
    seen: Boolean,
    messages: [
      {
        sender: String,
        receiver: String,
        message: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UsersChat = mongoose.model("UsersChat", userChatSchema);

module.exports = UsersChat;
