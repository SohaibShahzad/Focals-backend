const express = require("express");
const router = express.Router();
const multer = require("multer");

const mulParse = multer();
const parseData = mulParse.none();


const {
  getAllBlogs,
  getBlogWithImage,
  addNewBlogWithImage,
  getSpecialBlog,
  deleteBlog,
  updateBlogById,
  parser
} = require("../controller/blogsController");

router.get("/getAllBlogs", getAllBlogs);
router.get("/getSpecialBlog", getSpecialBlog);
router.get("/getBlogWithImage/:id", getBlogWithImage);
router.post("/addNewBlogWithImage", parser.single("image"), addNewBlogWithImage);
router.delete("/deleteBlog/:id", deleteBlog);
router.put("/updateBlogById/:id", parser.single("image"), updateBlogById);

module.exports = router;
