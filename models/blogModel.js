const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String, required: false },
  tags: { type: [String] },
  isSpecial: { type: Boolean },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
