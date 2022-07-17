const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Review = require("./../models/Review");
const Blog = require("./../models/Blog");
const { find } = require("./../models/Blog");

exports.createReview = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const blogId = req.params.blogId;
  console.log(userId, blogId);
  const getBlog = await Blog.findById(blogId);

  //CHECK IF BLOG WITH THIS ID EXIST!
  if (!getBlog) {
    return next(new AppError(`No Blog With id=${blogId}`, 404));
  }

  //CHECK IF THE USER SEND REVIEW FOR THIS BLOG BEFORE OR NOT!
  const checkReview = await Review.find({ blog: blogId, user: userId });
  if (checkReview.length > 0) {
    return next(new AppError("You review this blog 1-time", 400));
  }

  const review = await new Review({
    user: userId,
    blog: blogId,
    desc: req.body.desc,
    score: req.body.score,
  });
  await review.save();
  // const x = await User.findById({ id: req.user });
  // console.log(x);
  res.json({ data: review });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const allRev = await Review.find({})
    .populate({
      path: "user",
      select: "name email",
    })
    .populate({
      path: "blog",
      select: "title",
    });
  if (allRev.length === 0) {
    return next(new AppError("no reviews found", 404));
  }
  res.status(200).json({
    data: allRev,
  });
});

//DELETE SINGLE REVIEW
exports.deleteSingleReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.reviewId;

  const findReview = await Review.find({ _id: reviewId });
  if (findReview.length === 0) {
    return next(new AppError(`No review with this id=${reviewId} exists`, 404));
  }

  await Review.deleteOne({ _id: reviewId });
  res.status(200).json({ msg: "deleted" });
});

//DELETE ALL REVIEWS
exports.deleteAllReviews = catchAsync(async (req, res, next) => {
  await Review.deleteMany({});
  res.status(200).json({ msg: "All Review Deleted" });
});
