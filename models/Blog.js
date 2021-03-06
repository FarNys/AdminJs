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
    averageScore: {
      type: Number,
    },
    list: {
      type: Array,
    },
    photo: {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BlogSchema.pre("remove", async function (next) {
  await this.model("reviews").deleteMany({ blog: this._id });
  next();
});

BlogSchema.virtual("reviews", {
  ref: "reviews",
  localField: "_id",
  foreignField: "blog",
  justOne: false,
});

module.exports = mongoose.model("blogs", BlogSchema);
