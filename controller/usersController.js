const User = require("../models/usersModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Contact = require("../models/contactModel");
const crypto = require("crypto");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.url.toString().split("/");
    const deletedUser = await User.findByIdAndDelete(userId[2]);
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
}

const verifyOTPandRegister = async (req, res, next) => {
  const {username, password, otp} = req.body;
  console.log(password, otp);
  try {
    const user = await User.findOne({username});

    if(!user) {
      return res.status(404).json({message: "User not found"});
    }
    if(user.otp !== otp) {
      return res.status(401).json({message: "OTP not matched"});
    }
    if(user.otpExpires < new Date()) {
      return res.status(401).json({message: "OTP expired"});
    }

    await user.setPassword(password, async (err) => {
      if(err) {
        return res.status(500).json({message: err.message});
      }
      user.isVerified = true;
      await user.save();
      passport.authenticate("user")(req, res, function () {
        res.status(200).json({message: "User created"});
      })
    });

  } catch (error) {
    next(error);
  }
}

const userLogout = async (req, res) => {
    res.status(200).json({ message: "User logged out" });
};

const verifyUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    User.authenticate()(username, password, (err, user, options) => {
      if (err) {
        return res.status(500).json({ message: "Error verifying User" });
      }
      if (!user) {
        return res.status(401).json({ message: "User not found or Invalid password" });
      }
      if (!user.isVerified) {
        return res.status(401).json({ message: "User not verified" });
      }

      const token = jwt.sign({ id: user._id, type: "user" }, "FUTUREfocals", {
        expiresIn: "7d",
      });
      return res.status(200).json({ message: "User Verified", token: token });
    });
  } catch (err) {
    return res.status(500).json({ message: "Error verifying User" });
  }
};

const otpEmail = async (req, res, next) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = new Date();
  otpExpires.setMinutes(otpExpires.getMinutes() + 10);
  
  const newUser = new User({
    firstName: req.body.fname,
    lastName: req.body.lname,
    username: req.body.username,
    isVerified: false,
    otp: otp,
    otpExpires: otpExpires,
  })
  
  try{
    await newUser.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error creating User" });
  }
  
  var savedContact= [];
  try{
    savedContact = await Contact.find({});
  } catch (err) {
    console.log("Not Fetched");
  }

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: savedContact[0].email,
      pass: savedContact[0].password,
    },
  });
  let mailOptions = {
    from: "FutureFocals",
    to: req.body.username,
    subject: `OTP for Registeration at FutureFocals`,
    text: `Your OTP is ${otp} and it will expire in 10 minutes`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      res.json(err);
    } else {
      res.json(info);
    }
  });


}

module.exports = {
  getAllUsers,
  verifyOTPandRegister,
  userLogout,
  verifyUser,
  deleteUser,
  otpEmail,
};
