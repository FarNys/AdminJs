const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/User");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({}).select("-password -__v");
  if (!users) {
    return next(new AppError("there is no user!", 404));
  } else {
    res.status(200).json({
      dataLength: users.length,
      data: users,
    });
  }
});

exports.getSingleUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate({
      path: "blogs",
      select: "-__v",
    })
    .select("-password -__v -id");
  if (!user) {
    return next(new AppError("No user with this id", 404));
  } else {
    res.status(200).json({
      // dataLength: user.length,
      data: user,
    });
  }
});

exports.deleteSingleUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user with this id", 404));
  }
  user.remove();
  res.status(200).json({ msg: "Deleted" });
});
