const Blog = require("../models/blogModel");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../utils/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogs",
    format: async (req, file) => {
      // Get the file extension
      const fileExtension = path.extname(file.originalname).toLowerCase();

      // Check if the extension is allowed and return the format
      if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
        return "jpg";
      } else if (fileExtension === ".png") {
        return "png";
      } else {
        throw new Error("Unsupported file format");
      }
    },
    public_id: (req, file) => {
      // Remove file extension and add a unique identifier to the public ID
      const uniqueID = Date.now();
      return `blogs/${path.parse(file.originalname).name}_${uniqueID}`;
    },
  },
});

const parser = multer({ storage: storage });

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({});

    const blogsWithImages = await Promise.all(
      blogs.map(async (blog) => {
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
    res.status(500).json({ message: error.message });
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

const getBlogWithImage = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new Error("Blog not found");
    }

    const imageData = await cloudinary.api.resource(blog.image, {
      resource_type: "image",
    });

    res.json({
      ...blog._doc,
      image: imageData.secure_url,
    });
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
  const { title, content, author, image, blogTags, isSpecial } = req.body;
  const formattedDate = new Date(req.body.date);
  const date = formattedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // const image = blogImage;
  const parsedTags = JSON.parse(blogTags);
  const tags = parsedTags.map((element) => {
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
  const image = req.file.filename;

  const parsedBlog = {
    title,
    content,
    author,
    date,
    image,
    isSpecial,
  };

  const newBlog = new Blog(parsedBlog);
  try {
    const savedBlog = await newBlog.save();
    res.status(200).json({ message: `Blog Saved and the obj is ${savedBlog}` });
  } catch (error) {
    next(error);
  }
};

const addNewBlog = async (req, res, next) => {
  const { title, content, author, image, blogTags, isSpecial } = req.body;
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

  const parsedBlog = {
    title,
    content,
    author,
    date,
    image,
    isSpecial,
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
  getBlogWithImage,
  addNewBlog,
  addNewBlogWithImage,
  deleteBlog,
  updateBlogById,
  parser,
};
