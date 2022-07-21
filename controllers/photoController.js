const path = require("path");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Photo = require("./../models/Photo");

exports.CreatePhoto = catchAsync(async (req, res, next) => {
  //   console.log(req.body);
  //   const x = await Photo.find({});
  //   console.log(x);
  const photo = await Photo.find({ title: req.body.title });
  console.log(photo);
  if (photo.length !== 0) {
    return next(
      new AppError(`there is photo with same title=${req.body.title}`, 404)
    );
  }

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

  file.name = `${req.body.title}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      new AppError(`Problem with uploading image)`, 500);
    }
    const photo = new Photo({
      title: req.body.title,
      url: file.name,
    });
    await photo.save();
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });

  //   console.log(file.name);
});
