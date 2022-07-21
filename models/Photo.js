const mongoose = require("mongoose");

const PhotoSchema = mongoose.Schema({
  title: {
    type: String,
  },
  url: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("photos", PhotoSchema);
