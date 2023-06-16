const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema({
  linkName: {
    type: String,
  },
  linkURL: {
    type: String,
  },
});

const SocialLink = mongoose.model("SocialLink", socialLinkSchema);

module.exports = SocialLink;
