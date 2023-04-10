const Admin = require("../models/adminModel");
const passport = require("passport");

const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (error) {
    next(error);
  }
};

const addNewAdmin = async (req, res, next) => {
  const encryptedpassword = req.body.password;
  Admin.register({username: req.body.username, hint: req.body.hint}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.status(500).json({message: err.message});
    } else {
      passport.authenticate("local")(req, res, function(){
        res.status(200).json({message: "Admin created"});
      });
    }

  });
  // const { username } = req.body;
  // const encryptedpassword = req.body.password;
  // const password = encryptedpassword;
  // const encryptedAdmin = {
  //   username,
  //   password,
  // };
  // const newAdmin = new Admin(encryptedAdmin);
  // try {
  //   const savedAdmin = await newAdmin.save();
  //   res
  //     .status(200)
  //     .json({ message: `Portfolio Saved and the obj is ${savedAdmin}` });
  // } catch (error) {
  //   next(error);
  // }
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
    const { username } = req.body;
    const encryptedpassword = req.body.password;
    const password = encryptedpassword;
    const encryptedAdmin = {
      username,
      password,
    };
    const newAdmin = new Admin(encryptedAdmin);
    try {
    const adminId = req.url.toString().split("/");
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId[2],
      newAdmin
    );
    res.json(updatedAdmin);
  } catch (error) {
    next(error);
  }
};

const verifyAdmin = async (req, res, next) => {
  const admin = new Admin({
    username: req.body.username,
    password: req.body.password,
    hint: req.body.hint
  });
  req.login(admin, function(err){
    if(err){
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.status(200).json({message: "Admin verified"});
      });
    }
  });

}





module.exports = {
  getAllAdmins,
  addNewAdmin,
  deleteAdmin,
  updateAdminById,
  verifyAdmin
};
