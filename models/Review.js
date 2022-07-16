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
    unique: true,
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

module.exports = mongoose.model("reviews", ReviewSchema);
