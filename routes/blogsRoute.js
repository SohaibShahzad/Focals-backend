const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getAllBlogIds,
  getBlogById,
  getBlogWithImage,
  addNewBlog,
  addNewBlogWithImage,
  getSpecialBlog,
  deleteBlog,
  updateBlogById,
  parser
} = require("../controller/blogsController");

router.get("/getAllBlogs", getAllBlogs);
router.get("/getAllBlogIds", getAllBlogIds);
router.get("/getSpecialBlog", getSpecialBlog);
router.get("/getBlogById/:id", getBlogById);
router.get("/getBlogWithImage/:id", getBlogWithImage);
router.post("/addNewBlog", addNewBlog);
router.post("/addNewBlogWithImage", parser.single("image"), addNewBlogWithImage);
router.delete("/deleteBlog/:id", deleteBlog);
router.put("/updateBlogById/:id", updateBlogById);

module.exports = router;
