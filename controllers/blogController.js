const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Blog = require("./../models/Blog");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  let query;

  //CREATE A CLONE FROM SENT QUERY
  const reqQuery = { ...req.query };

  //WE CAN DEFINE EXCLUDE LIST TO PREVENT IT FROM SEARCHING!
  let excludeList = ["title"];
  excludeList.forEach((el) => delete reqQuery[el]);

  //RE BUILD SENT QUERY FOR CHANGING gte & ... to $gte & ...
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //CHANGE BACK TO DEFAULT JSON FILE
  query = Blog.find(JSON.parse(queryStr));

  //CHECK IF THERE IS A (SELECTED} FIELD TO SHOW
  // THEN ADD SELECT METHOD TO JUST RETURN THAT FIELD
  if (req.query.selected) {
    const fields = req.query.selected.split(",").join(" ");
    query = query.select(fields);
  }

  //ADD SORT IF EXIST
  if (req.query.sort) {
    const fields = req.query.sort.split(",").join(" ");
    query = query.sort(fields);
  }

  //ADD PAGINATION
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Blog.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      nextPage: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      prevPage: page - 1,
      limit,
    };
  }

  const data = await query
    // .populate("newItems");
    .populate({ path: "user", select: "name -_id" });
  if (data.length === 0) {
    return next(new AppError("no data found", 204));
  }
  res.status(200).json({ total, dataLength: data.length, pagination, data });
});
exports.deleteAllBlogs = async (req, res) => {
  try {
    const getBlogs = await Blog.deleteMany({});
    console.log(getBlogs);
    res.status(200).json({ msg: "All Blogs Deleted" });
  } catch (error) {
    console.log(error);
  }
};

exports.createBlog = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const { title, desc, point, list } = req.body;

  const newBlog = new Blog({
    user: req.user.id,
    categories: req.body.categories,
    title,
    desc,
    point,
    list,
  });
  const blog = await newBlog.save();
  res.status(201).json({ data: blog });
});

exports.unwindBlog = async (req, res) => {
  console.log(req);
  try {
    const getUnwind = await Blog.aggregate([
      { $unwind: "$list" },
      {
        $match: {
          point: { $gte: 0 },
        },
      },
      // {
      //   $group: {
      //     _id: null,
      //     items: { $push: "$title" },
      //     sumPoint: { $sum: "$point" },
      //     dataLength: { $sum: 1 },
      //   },
      // },
      // {
      //   $addFields: {
      //     extraField: "$sumPoint",
      //   },
      // },
      {
        $project: { _id: 0, __v: 0 },
      },
    ]);
    res.status(200).json(getUnwind);
  } catch (error) {
    res.status(500).json({ msg: "ServEr ErroR.!" });
  }
};

exports.aggregateBlog = async (req, res) => {
  try {
    const stats = await Blog.aggregate([
      {
        $match: {
          point: { $gte: 1 },
        },
      },
      {
        $group: {
          // _id: "$title",
          _id: null,
          averagePoint: { $avg: "$point" },
          length: { $sum: 1 },
          summAll: { $sum: "$point" },
        },
      },
    ]);
    console.log(stats);
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
  }
};

// exports.getSingleBlog = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   if (id.length !== 24) {
//     next(new AppError("cannot find blog with this id", 404));
//   }
//   const blog = await Blog.findById(id).select("-_id -__v");
//   if (!blog) {
//     next(new AppError("cannot find blog with this id", 404));
//   }
//   res.status(200).json(blog);
// });
exports.getSingleBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  // if (id.length !== 24) {
  //   next(new AppError("cannot find blog with this id", 404));
  // }
  const blog = await Blog.findById(id)
    .select("-__v")
    .populate({
      path: "reviews",
      populate: { path: "user", select: "name email" },
    })
    .populate({
      path: "categories",
      select: "title",
    });

  if (!blog) {
    return next(new AppError("cannot find blog with this id", 404));
  }
  res.status(200).json(blog);
});
