//A-IMPORT EXPRESS FOR USING ROUTER & IMPORT CONSTROLLER(FUNCTION) TO USING FOR EVERY ROUTE HTTP REQUEST
const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();
//B-ADD FUNCTIONALITY FOR A ROUTE AND ALL ITS HTTP REQUEST
router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.saveProducts);

router
  .route("/:id")
  .get(productController.getSingleProduct)
  .patch(productController.updateSingleProduct);
module.exports = router;
