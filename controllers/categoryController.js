const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Category = require("./../models/Category");

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = req.body.category;
  const findCat = await Category.find({ title: category });
  if (findCat.length !== 0) {
    return next(new AppError("already category wih this title exist", 400));
  }
  const newCat = new Category({
    title: category,
  });
  await newCat.save();
  res.status(201).json({
    msg: "New Category Created",
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const allCats = await Category.find({});
  if (!allCats) {
    return next(new AppError("no categories found", 404));
  }
  res.status(200).json({
    data: allCats,
  });
});
