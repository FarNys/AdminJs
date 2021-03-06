const mongoose = require("mongoose");
const BlogSchema = require("./Blog");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAuthor: {
      type: String,
      default: false,
    },
    isAdmin: {
      type: String,
      default: false,
    },
    isBlock: {
      type: String,
      default: false,
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

UserSchema.pre("remove", async function (next) {
  await this.model("blogs").deleteMany({ user: this._id });
  await this.model("reviews").deleteMany({ user: this._id });
  next();
});

UserSchema.virtual("blogs", {
  ref: "blogs",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

module.exports = mongoose.model("users", UserSchema);
