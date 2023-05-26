const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const subAdminSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  hint: {
    type: String,
  },
  permissions: {
    type: [String],
  }
});

subAdminSchema.plugin(passportLocalMongoose);

const SubAdmin = mongoose.model("SubAdmin", subAdminSchema);

module.exports = SubAdmin;
