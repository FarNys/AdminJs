const express = require("express");
const categoryController = require("../controllers/categoryController");
const authMW = require("../middleware/authMW");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(categoryController.createCategory)
  .get(categoryController.getAllCategories);

router
  .route("/:categoryId")
  .delete(authMW, categoryController.deleteSingleCategory);

module.exports = router;
