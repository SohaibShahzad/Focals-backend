const nodemailer = require("nodemailer");
const Contact = require("../models/contactModel");

const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;
  console.log(email);
  console.log(name);
  console.log(message);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sohaib022k@gmail.com",
      pass: "zbzwrjmkxyzbunyp",
    },
  });
  let mailOptions = {
    from: "FutureFocals",
    to: "sohaib022k@gmail.com",
    subject: `Subject: ${name}`,
    html: `${message} ${email}`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    console.log("testing");
    if (err) {
      console.log("error");
      res.json(err);
    } else {
      console.log("Did it work?");
      res.json(info);
    }
  });
};

const addContactData = async (req, res) => {
  const { email, name, password } = req.body;
  const parsedContact = {
    email,
    name,
    password,
  };
  const newContact = new Contact(parsedContact);

  try {
    console.log("In here");
    const savedContact = await newContact.save();
    res.status(200).json({ message: `Contact Saved and the obj is ${savedContact}` });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const getContactData = async (req, res, next) => {
  try {
    const contactData = await Contact.find({});
    res.json(contactData);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const updateContactData = async (req, res, next) => {
  const { email, name, password } = req.body;
  const parsedContact = {
    email,
    name,
    password,
  };
  try {
    const contactid = req.url.toString().split("/");
    const updatedContact = await Contact.findByIdAndUpdate(
      contactid[2],
      parsedContact
    );
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
}

const deleteContactData = async (req, res, next) => {
  try {
    const contactid = req.url.toString().split("/");
    const deletedContact = await Contact.findByIdAndDelete(contactid[2]);
    res.json(deletedContact);
  } catch (error) {
    next(error);
  }
}
  



//
module.exports = {
  sendEmail,
  addContactData,
  getContactData,
  updateContactData,
  deleteContactData,
};
