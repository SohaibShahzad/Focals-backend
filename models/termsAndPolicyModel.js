const mongoose = require("mongoose");

const termsAndPolicySchema = new mongoose.Schema({
  contentName: {
    type: String,
    enum: ["Terms and Conditions", "Privacy Policy"],
  },
  contentPara: {
    type: String,
  },
});

const TermsAndPolicy = mongoose.model("TermsAndPolicy", termsAndPolicySchema);

module.exports = TermsAndPolicy;
