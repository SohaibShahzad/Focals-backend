const Blog = require("../models/blogModel");

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    next(error);
  }
};

const getAllBlogIds = async (req, res, next) => {
  try {
    const blogIds = await Blog.find({}, { _id: 1 });
    res.json(blogIds);
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const blogid = req.url.toString().split("/");
    const blogById = await Blog.findById(blogid[2]);
    res.json(blogById);
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blogid = req.url.toString().split("/");
    const deletedBlog = await Blog.findByIdAndDelete(blogid[2]);
    res.json(deletedBlog);
  } catch (error) {
    next(error);
  }
};

const getSpecialBlog = async (req, res, next) => {
  try {
    const specialBlog = await Blog.find({ isSpecial: true }).limit(5);
    res.json(specialBlog);
  } catch (error) {
    next(error);
  }
};

const updateBlogById = async (req, res, next) => {
  const { title, content, author, image, blogTags, isSpecial } = req.body;
  const formattedDate = new Date(req.body.date);
  const date = formattedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // const image = blogImage;
  const parsedTags = JSON.parse(blogTags);
  const tags = parsedTags.map(element => {
    return element.replaceAll(" ", "");
  });
  const parsedBlog = {
    title,
    content,
    author,
    date,
    image,
    isSpecial,

  };
  try {
    const blogid = req.url.toString().split("/");
    const updatedBlog = await Blog.findByIdAndUpdate(blogid[2], parsedBlog);
    res.json(updatedBlog); 
  } catch (error) {
    next(error);
  }
};

const addNewBlog = async (req, res, next) => {
  const { title, content, author, image, blogTags, isSpecial } = req.body;
  const formattedDate = new Date(req.body.date);
  const date = formattedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const parsedTags = JSON.parse(blogTags);
  const tags = parsedTags.map(element => {
    return element.replaceAll(' ', '');
  });

  const parsedBlog = {
    title,
    content,
    author,
    date,
    image,
    isSpecial
  };
  const newBlog = new Blog(parsedBlog);
  try {
    const savedBlog = await newBlog.save();
    res.status(200).json({ message: `Blog Saved and the obj is ${savedBlog}` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getAllBlogIds,
  getBlogById,
  getSpecialBlog,
  addNewBlog,
  deleteBlog,
  updateBlogById,
};
