const express = require("express");
const reviewController = require("../controllers/reviewController");
const authMW = require("../middleware/authMW");
const router = express.Router({ mergeParams: true });

router
  .route("/:blogId")
  //   .get(reviewController.getAllBlogs)
  .post(authMW, reviewController.createReview);

router.route("/:reviewId").delete(authMW, reviewController.deleteSingleReview);

router.route("/").get(reviewController.getAllReviews);
module.exports = router;
