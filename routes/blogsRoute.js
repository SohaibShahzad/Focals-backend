const express = require("express");
const router = express.Router();

const {
  getAllBlogs,
  getTotalBlogsCount,
  getBlogWithImage,
  addNewBlogWithImage,
  getSpecialBlog,
  deleteBlog,
  updateBlogById,
  upload,
} = require("../controller/blogsController");

// Use the 'upload' middleware for routes that need to handle image uploads
router.get("/getAllBlogs", getAllBlogs);
router.get("/getTotalBlogsCount", getTotalBlogsCount);
router.get("/getSpecialBlog", getSpecialBlog);
router.get("/getBlogWithImage/:id", getBlogWithImage);
router.post(
  "/addNewBlogWithImage",
  upload.single("image"),
  addNewBlogWithImage
);
router.delete("/deleteBlog/:id", deleteBlog);
router.put("/updateBlogById/:id", upload.single("image"), updateBlogById);

module.exports = router;
