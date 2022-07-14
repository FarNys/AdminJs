const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
      },
    ],
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BlogSchema.virtual("reviews", {
  ref: "reviews",
  localField: "_id",
  foreignField: "blog",
  justOne: false,
});
// BlogSchema.virtual("divideByTwo").get(function () {
//   return this.point * 100;
// });

module.exports = mongoose.model("blogs", BlogSchema);
