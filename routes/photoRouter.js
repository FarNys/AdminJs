const express = require("express");
const photoController = require("../controllers/photoController");
const authMW = require("../middleware/authMW");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(authMW, photoController.CreatePhoto)
  .get(photoController.getAllPhotos);

module.exports = router;
