const Blog = require("../models/Blog");
const calculateReadingTime = require("../utils/calculateReadingTime");
const logger = require("../utils/logger");

exports.getAllBlogs = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    state,
    author,
    title,
    tags,
    sortBy = "timestamp",
    order = "desc",
  } = req.query;
  try {
    const query = { state: "published" && "draft" };
    if (state) query.state = state;
    if (author) query.author = author;
    if (title) query.title = new RegExp(title, "i");
    if (tags) query.tags = { $in: tags.split(",") };

    const blogs = await Blog.find(query)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("author", "first_name last_name email");

    const count = await Blog.countDocuments(query);

    res.status(200).json({
      blogs,
      page,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.createBlog = async (req, res) => {
  const { title, description, tags, body } = req.body;
  try {
    const blog = new Blog({
      title,
      description,
      author: req.user.id,
      tags,
      body,
      reading_time: calculateReadingTime(body),
    });
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId).populate(
      "author",
      "first_name last_name email"
    );
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    blog.read_count += 1;
    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlogState = async (req, res) => {
  const { blogId, state } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    if (blog.author.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }
    blog.state = state;
    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  const { blogId, title, description, tags, body } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    if (blog.author.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.tags = tags || blog.tags;
    blog.body = body || blog.body;
    blog.reading_time = calculateReadingTime(blog.body);
    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  const { blogId } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }
    if (blog.author.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }
    await blog.deleteOne();
    res.status(200).json({ message: "Blog removed" });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};
