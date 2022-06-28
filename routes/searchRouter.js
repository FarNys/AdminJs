const express = require("express");
const productSearchController = require("../controllers/productSearchController");
const router = express.Router();

router.route("/").get(productSearchController.getSearchedProduct);

module.exports = router;
