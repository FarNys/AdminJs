const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blogs",
  },
  desc: {
    type: String,
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

module.exports = mongoose.model("reviews", ReviewSchema);
