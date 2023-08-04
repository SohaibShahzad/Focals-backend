const User = require("../models/usersModel");
const UserProjects = require("../models/projectsModel");
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
};

const getUserbyId = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getTotalUsersCount = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ totalUsers: users.length });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.url.toString().split("/");
    const deletedUser = await User.findByIdAndDelete(userId[2]);
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
};

const verifyOTPandRegister = async (req, res, next) => {
  const { username, password, otp } = req.body;
  console.log(username, password, otp);
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(401).json({ message: "OTP not matched" });
    }
    if (user.otpExpires < new Date()) {
      return res.status(401).json({ message: "OTP expired" });
    }

    await user.setPassword(password, async (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      user.isVerified = true;
      await user.save();

      await UserProjects.updateMany(
        { email: username },
        { $set: { user: user._id } }
      );

      passport.authenticate("user")(req, res, function () {
        res.status(200).json({ message: "User created" });
      });
    });
  } catch (error) {
    next(error);
  }
};

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
        return res.status(401).json({ message: "No Match!" });
      }
      if (!user.isVerified) {
        return res.status(401).json({ message: "User not verified" });
      }
      console.log(user);
      // const name = foundUser[0].firstName + " " + foundUser[0].lastName

      const token = jwt.sign(
        { id: user._id, type: "user", username },
        "FUTUREfocals",
        {
          expiresIn: "7d",
        }
      );
      return res
        .status(200)
        .json({ message: "Verified!!", token: token, user: user });
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
  });

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error creating User" });
  }

  var savedContact = [];
  try {
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
};

const resetPasswordRequest = async (req, res, next) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    var savedContact = [];
    try {
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
      to: username,
      subject: `OTP for Password Reset at FutureFocals`,
      text: `Your OTP is ${otp} and it will expire in 10 minutes`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return res.status(500).json({ message: "Error sending OTP" });
      }
      return res.status(200).json({ message: "OTP sent" });
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTPforReset = async (req, res, next) => {
  const { username, otp } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(401).json({ message: "OTP not matched" });
    }
    if (user.otpExpires < new Date()) {
      return res.status(401).json({ message: "OTP expired" });
    }
    return res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = username;

    user.setPassword(password, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error resetting password" });
      } else {
        user
          .save()
          .then((updatedUser) => {
            return res
              .status(200)
              .json({ message: "Password reset successful" });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ message: "Error resetting password" });
          });
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getTotalUsersCount,
  getUserbyId,
  verifyOTPandRegister,
  userLogout,
  verifyUser,
  deleteUser,
  otpEmail,
  resetPasswordRequest,
  verifyOTPforReset,
  resetPassword,
};
