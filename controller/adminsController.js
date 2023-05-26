const Admin = require("../models/adminModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (error) {
    next(error);
  }
};

const getAdminbyId = async (req, res, next) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findById(adminId);
    res.json(admin);
  } catch (error) {
    next(error);
  }
}

const addNewAdmin = async (req, res, next) => {
  Admin.register(
    { username: req.body.username, hint: req.body.hint },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
      } else {
        passport.authenticate("admin")(req, res, function () {
          res
            .status(200)
            .cookie("connect.sid", req.sessionID)
            .json({ message: "Admin created" });
        });
      }
    }
  );
};

const deleteAdmin = async (req, res, next) => {
  try {
    const adminId = req.url.toString().split("/");
    const deletedAdmin = await Admin.findByIdAndDelete(adminId[2]);
    res.json(deletedAdmin);
  } catch (error) {
    next(error);
  }
};

const updateAdminById = async (req, res, next) => {
  const { username, hint, password } = req.body;
  const adminId = req.url.toString().split("/");

  try {
    const admin = await Admin.findById(adminId[2]);
    if (!admin) {
      throw new Error("Admin not found");
    }

    admin.username = username;
    admin.hint = hint;

    admin.setPassword(password, function(err) {
      if (err) {
        next(err);
      } else {
        admin.save()
          .then(updatedAdmin => {
            res.json(updatedAdmin);
          })
          .catch(err => {
            next(err);
          });
      }
    });
  } catch (error) {
    next(error);
  }
};

const verifyAdmin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    Admin.authenticate()(username, password, (err, user, options) => {
      if (err) {
        return res.status(500).json({ message: "Error verifying Admin" });
      }
      if (!user) {
        return res.status(401).json({ message: "Admin not found" });
      }

      const token = jwt.sign(
        { id: user._id, type: "admin", role: user.permissions },
        "FUTUREfocalsADMIN",
        {
          expiresIn: "7d",
        }
      );
      return res.status(200).json({ message: "Admin verified", token: token });
    });
  } catch {
    return res.status(500).json({ message: "Error verifying Admin" });
  }
};

const adminLogout = async (req, res) => {
  res.status(200).json({ message: "Admin logged out" });
};

module.exports = {
  getAllAdmins,
  getAdminbyId,
  addNewAdmin,
  deleteAdmin,
  updateAdminById,
  verifyAdmin,
  adminLogout,
};
