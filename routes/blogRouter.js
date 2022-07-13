const express = require("express");
const blogController = require("../controllers/blogController");
const authMW = require("../middleware/authMW");
const router = express.Router();

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(authMW, blogController.createBlog)
  .delete(authMW, blogController.deleteAllBlogs);
//   .post(productController.saveProducts);
router.route("/unwind").get(blogController.unwindBlog);
router.route("/stats").get(blogController.aggregateBlog);
router.route("/:id").get(blogController.getSingleBlog);

module.exports = router;
