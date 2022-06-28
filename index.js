const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const productRouter = require("./routes/productRouter");
const searchRouter = require("./routes/searchRouter");
const registerRouter = require("./routes/registerRouter");
const loginRouter = require("./routes/loginRouter");
const blogRouter = require("./routes/blogRouter");
const adminRouter = require("./routes/adminRouter");

//ERROR CLASS AND HANDLER
const AppError = require("./utils/appError");
const errorHandling = require("./utils/errorHandling");
const errorHandler = require("./utils/errHandler");
//
dotenv.config({ path: "./config.env" });

const app = express();
//JSON WILL SHOW AS UNDEFINED IN POST DATA WITHOUT THIS
app.use(express.json());
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const router = express.Router();
const PORT = 3456;

connectDB();

app.listen(PORT, (req, res) => {
  console.log(`server started on ${PORT}`);
});
//REAL API ADDRESS AND ITS ROUTE FUNCTION (TO HANDLE ALL HTTP METHODS)
app.use("/s", (req, res) => {
  res.status(200).json({
    status: "success",
    msg: "Your Requests have coug ss",
  });
});

//AUTHENTICATION
app.use("/api/v1/register", registerRouter);
app.use("/api/v1/login", loginRouter);

//PRODUCTS
app.use("/api/v1/products", productRouter);
//SEARCH PRODUCT
app.use("/api/v1/product/search", searchRouter);
//BLOG ROUTERS
app.use("/api/v1/blogs", blogRouter);

//ADMIN ROUTER
app.use("/admin", adminRouter);

//HANDLE IF THERE IS ALL UNDEFINED ROUTE
app.all("*", (req, res, next) => {
  next(new AppError(`Cant Take the Url ${req.originalUrl}`, 404));
});
app.use(errorHandler);
//e
