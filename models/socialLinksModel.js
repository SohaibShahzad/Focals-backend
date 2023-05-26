const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema({
  linkName: {
    type: String,
    enum: ["Twitter", "LinkedIn", "Instagram", "Facebook"],
  },
  linkURL: {
    type: String,
  },
});

const SocialLink = mongoose.model("SocialLink", socialLinkSchema);

module.exports = SocialLink;
