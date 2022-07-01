const express = require("express");
const userController = require("../controllers/userController");
const authMW = require("../middleware/authMW");
const router = express.Router();

router.route("/").get(authMW, userController.getAllUsers);
router
  .route("/:id")
  .get(authMW, userController.getSingleUser)
  .delete(authMW, userController.deleteSingleUser);
//   .post(authMW, blogController.createBlog)
//   .delete(blogController.deleteAllBlogs);
//   .post(productController.saveProducts);

module.exports = router;
