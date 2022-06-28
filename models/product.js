//A-IMPORT MONGOOSE FOR MODELING
const mongoose = require("mongoose");

//B-CREATE DEFAULT SCHEMA
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You Sould Add a Name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "Add A Price PLease"],
  },
  timeStamp: {
    type: Date,
  },
});
//C-GIVE A NAME TO YOUR SCHEMA IN DATABASE AND EXPORT IT
module.exports = mongoose.model("Product", productSchema);
