//A-IMPORT SCHEMA TO SAVE,POST AND ... TO OUT DATABASE
const Product = require("./../models/product");

//B-OUR CONTROLLER(FUNCTIONS) FOR ROUTES
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (products.length > 0) {
      res.status(200).json({
        data: products,
        msg: "succesS!",
      });
    } else {
      res.status(404).json({
        msg: "There are no DatA!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.saveProducts = async (req, res) => {
  const { name, rating, price } = req.body;
  console.log(req.body);
  const product = new Product({
    name,
    rating,
    price,
    timeStamp: Date.now(),
  });
  try {
    if (!name || !rating || !price) {
      res.status(400).json({
        msg: "You Must Send All Values",
      });
    } else {
      const saveProduct = await product.save();
      res.status(200).json({
        saveProduct,
        msg: "successful save",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(204).json({
        msg: "product not found",
      });
    }
    res.status(200).json({
      data: product,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!!!");
  }
};
exports.updateSingleProduct = async (req, res) => {
  const items = req.body;
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, items, {
      runValidators: true,
    });
    res.status(202).json({
      data: product,
      msg: "successfully updated",
    });
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
};
