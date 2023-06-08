const SubAdmin = require("../models/subAdminModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const getAllSubAdmins = async (req, res, next) => {
  try {
    const subAdmins = await SubAdmin.find({});
    res.json(subAdmins);
  } catch (error) {
    next(error);
  }
};

const getTotalSubAdmins = async (req, res, next) => {
  try {
    const subAdmins = await SubAdmin.find({});
    res.json(subAdmins.length);
  } catch (error) {
    next(error);
  }
};

const getSubAdminbyId = async (req, res, next) => {
  try {
    const subAdminId = req.params.id;
    const subAdmin = await SubAdmin.findById(subAdminId);
    res.json(subAdmin);
  } catch (error) {
    next(error);
  }
};

const getSubAdminByPermissions = async (req, res, next) => {
  try {
    const subAdmin = await SubAdmin.find({
      permissions: req.params.permissions,
    });
    res.json(subAdmin);
  } catch (error) {
    next(error);
  }
};

const addNewSubAdmin = async (req, res, next) => {
  SubAdmin.register(
    {
      username: req.body.username,
      hint: req.body.hint,
      permissions: req.body.permissions,
    },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
      } else {
        passport.authenticate("subAdmin")(req, res, function () {
          res
            .status(200)
            .cookie("connect.sid", req.sessionID)
            .json({ message: "SubAdmin created" });
        });
      }
    }
  );
};

const deleteSubAdmin = async (req, res, next) => {
  try {
    const subAdminId = req.params.id;
    const deletedSubAdmin = await SubAdmin.findByIdAndDelete(subAdminId);
    return res.json(deletedSubAdmin);
  } catch (error) {
    next(error);
  }
};

const updateSubAdminById = async (req, res, next) => {
  const { username, hint, password, permissions } = req.body;
  const subAdminId = req.params.id;

  try {
    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: "SubAdmin not found" });
    }

    subAdmin.username = username;
    subAdmin.hint = hint;
    subAdmin.permissions = permissions;

    subAdmin.setPassword(password, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
      } else {
        subAdmin.save();
        return res.json({ message: "SubAdmin updated" });
      }
    });
  } catch (error) {
    next(error);
  }
};

const verifySubAdmin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    SubAdmin.authenticate()(username, password, (err, user, options) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: "SubAdmin not found" });
      }

      const token = jwt.sign(
        { id: user._id, type: "subadmin", role: user.permissions },
        "FUTUREfocalsADMIN",
        {
          expiresIn: "7d",
        } 
      );
      return res.status(200).json({ message: "Sub-Admin verified", token });
    });
  } catch (error) {
    next(error);
  }
};

const subAdminLogout = async (req, res, next) => {
    return res.status(200).json({ message: "Sub-Admin logged out" });
}

module.exports = {
    getAllSubAdmins,
    getTotalSubAdmins,
    getSubAdminbyId,
    getSubAdminByPermissions,
    addNewSubAdmin,
    deleteSubAdmin,
    updateSubAdminById,
    verifySubAdmin,
    subAdminLogout
}