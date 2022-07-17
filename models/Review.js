const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: "blogs",
  },
  desc: {
    type: String,
  },
  score: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ReviewSchema.index(
//   {
//     user: 1,
//     blog: 1,
//   },
//   { unique: true, dropDups: true }
// );
ReviewSchema.statics.getAverageScore = async function (blogId) {
  const obj = await this.aggregate([
    {
      $match: { blog: blogId },
    },
    {
      $group: {
        _id: "$blog",
        averageScore: { $avg: "$score" },
      },
    },
  ]);
  console.log(obj);
  try {
    await this.model("blogs").findByIdAndUpdate(blogId, {
      averageScore: obj[0].averageScore,
    });
    const x = await this.model("reviews").find({ blog: blogId });
    console.log(x);
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", function () {
  this.constructor.getAverageScore(this.blog);
});

ReviewSchema.pre("remove", function () {
  this.constructor.getAverageScore(this.blog);
});

module.exports = mongoose.model("reviews", ReviewSchema);
