const User = require("../models/usersModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");

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

const addNewUser = async (req, res, next) => {
  User.register(
    {
      firstName: req.body.fname,
      lastName: req.body.lname,
      username: req.body.username,
    },
    req.body.password,
    function (err, user) {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        passport.authenticate("user")(req, res, function () {
          res
            .status(200)
            .cookie("connect.sid", req.sessionID)
            .json({ message: "User created" });
        });
      }
    }
  );
};

const userLogout = async (req, res) => {
    res.status(200).json({ message: "User logged out" });
};

const verifyUserSession = async (req, res, next) => {
  passport.authenticate("user", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.authenticated = true;
      return res
        .status(200)
        .json({ message: "User Verified", session: req.session });
    });
  })(req, res, next);
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

      const token = jwt.sign({ id: user._id, type: "user" }, "FUTUREfocals", {
        expiresIn: "7d",
      });
      return res.status(200).json({ message: "User Verified", token: token });
    });
  } catch (err) {
    return res.status(500).json({ message: "Error verifying User" });
  }
};

module.exports = {
  getAllUsers,
  addNewUser,
  userLogout,
  verifyUser,
  deleteUser,
};
