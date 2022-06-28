const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    point: {
      type: Number,
      default: 4,
    },
    list: {
      type: Array,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // }
);

// BlogSchema.virtual("divideByTwo").get(function () {
//   return this.point / 2;
// });

module.exports = mongoose.model("blogs", BlogSchema);
