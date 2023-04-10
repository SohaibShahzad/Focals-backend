const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  hint: {
    type: String,
  },
});

adminSchema.plugin(passportLocalMongoose);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;