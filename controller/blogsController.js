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

const getTotalBlogsCount = async (req, res, next) => {
  try {
    const totalBlogsCount = await Blog.countDocuments({});
    res.json(totalBlogsCount);
  } catch (error) {
    next(error);
  }
}

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
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete the image from Cloudinary using destroy function
    await cloudinary.uploader.destroy(blog.image);

    // Delete the blog from MongoDB
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    res.json(deletedBlog);
  } catch (error) {
    next(error);
  }
};



const deleteBlogsss = async (req, res, next) => {
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
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
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
      const parsedTags = JSON.parse(blogTags);
      tags = parsedTags.map((element) => {
        return element.replaceAll(" ", "");
      });
    }

    let image = blog.image;
    if (req.file) {
      if (req.file.filename !== blog.image) {
        await cloudinary.uploader.destroy(blog.image);
      }

      image = req.file.filename;
    }

    const updatedBlogData = {
      title,
      content,
      author,
      date,
      image,
      isSpecial,
    };
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedBlogData);
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

module.exports = {
  getAllBlogs,
  getTotalBlogsCount,
  getSpecialBlog,
  getBlogWithImage,
  addNewBlogWithImage,
  deleteBlog,
  updateBlogById,
  parser,
};
