const Blog = require("../models/blogModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// const cloudinary = require("../utils/cloudinaryConfig");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/var/www/media/blog-images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 11000000 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    const blogsWithImages = blogs.map((blog) => ({
      ...blog._doc,
      image: blog.image,
    }));

    res.json(blogsWithImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

const getTotalBlogsCount = async (req, res, next) => {
  try {
    const totalBlogsCount = await Blog.countDocuments({});
    res.json(totalBlogsCount);
  } catch (error) {
    next(error);
  }
};

const getBlogWithImage = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const imageUrl = `http://31.220.62.249/blog-images/${path.basename(
      blog.image
    )}`;

    res.json({
      ...blog._doc,
      image: imageUrl, // Provide the direct URL to the image
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blogToDelete = await Blog.findById(blogId);

    if (!blogToDelete) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the image file from the local storage
    const imagePath = path.join(
      "/var/www/media/blog-images",
      path.basename(blogToDelete.image)
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Blog.findByIdAndDelete(blogId);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getSpecialBlog = async (req, res, next) => {
  try {
    const specialBlog = await Blog.find({ isSpecial: true });

    const blogsWithImages = await Promise.all(
      specialBlog.map(async (blog) => {
        try {
          const imageData = await cloudinary.api.resource(blog.image, {
            resource_type: "image",
          });
          return {
            ...blog._doc,
            image: imageData.secure_url,
          };
        } catch (error) {
          console.error(
            `Error fetching image with public ID ${blog.image}:`,
            error
          );
          return blog;
        }
      })
    );

    res.json(blogsWithImages);
  } catch (error) {
    next(error);
  }
};

const updateBlogById = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blogToUpdate = await Blog.findById(blogId);
    if (!blogToUpdate) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { title, content, author, blogTags, isSpecial } = req.body;
    const formattedDate = new Date(req.body.date);
    const date = formattedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    let tags;
    if (blogTags) {
      tags = JSON.parse(blogTags).map((tag) => tag.trim().replace(/\s+/g, '-'));
    }

    let image = blogToUpdate.image;
    if (req.file) {
      // Remove the old image if it exists
      const oldImagePath = `/var/www/media/blog-images/${path.basename(blogToUpdate.image)}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      // Update with the new image path
      image = `http://31.220.62.249/blog-images/${req.file.filename}`;
    }

    const updatedBlogData = {
      title,
      content,
      author,
      date,
      image, // this will be either the new image or the old one if no new image was uploaded
      tags,
      isSpecial,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedBlogData, { new: true });
    res.json({ message: "Blog updated successfully", data: updatedBlog });
  } catch (error) {
    next(error);
  }
};


const addNewBlogWithImage = async (req, res, next) => {
  const { title, content, author, blogTags, isSpecial } = req.body;
  const formattedDate = new Date(req.body.date);
  const date = formattedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const parsedTags = JSON.parse(blogTags);
  const tags = parsedTags.map((element) => {
    return element.replaceAll(" ", "");
  });
  const image = req.file
    ? `http://31.220.62.249/blog-images/${req.file.filename}`
    : null;

  const newBlog = new Blog({
    title,
    content,
    author,
    date,
    image, // Save the relative path to the image in the database
    isSpecial,
  });

  try {
    const savedBlog = await newBlog.save();
    res.status(200).json({ message: `Blog Saved and the obj is ${savedBlog}` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getTotalBlogsCount,
  getSpecialBlog,
  getBlogWithImage,
  addNewBlogWithImage,
  deleteBlog,
  updateBlogById,
  upload,
};
