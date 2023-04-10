const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getAllBlogIds,
  getBlogById,
  addNewBlog,
  getSpecialBlog,
  deleteBlog,
  updateBlogById,
} = require("../controller/blogsController");

router.get("/getAllBlogs", getAllBlogs);
router.get("/getAllBlogIds", getAllBlogIds);
router.get("/getSpecialBlog", getSpecialBlog);
router.get("/getBlogById/:id", getBlogById);
router.post("/addNewBlog", addNewBlog);
router.delete("/deleteBlog/:id", deleteBlog);
router.put("/updateBlogById/:id", updateBlogById);

module.exports = router;
