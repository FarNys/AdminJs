const express = require("express");
const blogController = require("../controllers/blogController");
const authMW = require("../middleware/authMW");
const advancedResults = require("../middleware/advancedResults");
const Blog = require("../models/Blog");

const router = express.Router();

router
  .route("/")
  .get(
    advancedResults(Blog, "", [
      { path: "user", select: "name -_id" },
      { path: "categories", select: "title" },
    ]),
    blogController.getAllBlogs
  )
  .post(authMW, blogController.createBlog)
  .delete(authMW, blogController.deleteAllBlogs);
//   .post(productController.saveProducts);
router.route("/unwind").get(blogController.unwindBlog);
router.route("/stats").get(blogController.aggregateBlog);
router
  .route("/:id")
  .get(blogController.getSingleBlog)
  .delete(authMW, blogController.deleteSingleBlog);

module.exports = router;
