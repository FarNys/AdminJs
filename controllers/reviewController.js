const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Review = require("./../models/Review");
const Blog = require("./../models/Blog");

exports.createReview = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const blogId = req.params.blogId;
  console.log(userId, blogId);
  const getBlog = await Blog.findById(blogId);

  if (!getBlog) {
    return next(new AppError(`No Blog With id=${blogId}`, 404));
  }

  const review = await new Review({
    user: userId,
    blog: blogId,
    desc: req.body.desc,
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
  if (!allRev) {
    return next(new AppError("no reviews found", 404));
  }
  res.status(200).json({
    data: allRev,
  });
});
