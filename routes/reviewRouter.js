const express = require("express");
const reviewController = require("../controllers/reviewController");
const authMW = require("../middleware/authMW");
const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router
  .route("/:blogId")
  //   .get(reviewController.getAllBlogs)
  .post(authMW, reviewController.createReview);

router
  .route("/:reviewId")
  .get(reviewController.getSingleReview)
  .delete(authMW, reviewController.deleteSingleReview);

router
  .route("/")
  .get(
    advancedResults(Review, "", [
      { path: "user", select: "name email" },
      { path: "blog", select: "title" },
    ]),
    reviewController.getAllReviews
  )
  .delete(authMW, reviewController.deleteAllReviews);
module.exports = router;
