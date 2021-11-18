require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const restaurantRouter = require("./routes/restaurant");
const tagRouter = require("./routes/tags");
const cityRouter = require("./routes/cities");
const commentRouter = require("./routes/comments");


app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/restaurants", restaurantRouter);
app.use("/tags", tagRouter);
app.use("/cities", cityRouter);
app.use("/comments", commentRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(500).send(err.message);
});

module.exports = app;
