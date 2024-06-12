const Blog = require("../models/Blog");
const calculateReadingTime = require("../utils/calculateReadingTime");

const express = require("express");
const logger = require("../utils/logger");

//  const {} = require()

const { protect } = require("../middlewares/authMiddleware");
const {
  getAllBlogs,
  createBlog,
  getBlogById,
  updateBlog,
  updateBlogState,
  deleteBlog,
} = require("../controllers/blogController");

const router = express.Router();

//all blogs
router
  .route("/")
  //get
  .get(getAllBlogs)
  //post
  .post(protect, createBlog);
//get blog by ID
router.route("/:blogId").get(getBlogById);

//update blog state
router.put("/state", protect, updateBlogState);

// update blog
router.put("/", protect, updateBlog);
router.delete("/", protect, deleteBlog);
module.exports = router;
