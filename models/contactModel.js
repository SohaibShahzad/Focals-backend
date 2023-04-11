const moongose = require("mongoose");

const contactSchema = new moongose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Contact = moongose.model("Contact", contactSchema);

module.exports = Contact;
