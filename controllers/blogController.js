const path = require("path");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Blog = require("./../models/Blog");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  if (res.advancedResults.dataLength === 0) {
    return next(new AppError("no data found", 204));
  }
  res.status(200).json({ data: res.advancedResults });
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
          _id: "$title",
          // _id: null,
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

exports.deleteSingleBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const getBlog = await Blog.findById(blogId);
  if (getBlog.length === 0) {
    return next(new AppError(`Blog with id=${blogId} not exist`, 404));
  }
  getBlog.remove();
  res.status(200).json({
    msg: "successfully Deleted",
  });
});

exports.blogUploadPhoto = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new AppError(`No blog with id=${req.params.id} found`, 404));
  }
  console.log(req.files);

  if (!req.files) {
    return next(new AppError("Please Upload a File", 400));
  }
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    return next(new AppError("Please Upload a valid Image", 400));
  }

  if (file.size > process.env.MAX_UPLOAD_SIZE) {
    return next(
      new AppError(`Your Image size is too big (need less than ${1} MB)`, 400)
    );
  }

  file.name = `photo_${blog._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      new AppError(`Problem with uploading image)`, 500);
    }
    await Blog.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });

  console.log(file.name);
});
