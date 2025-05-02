var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Initialize the app first
var app = express();

// Serve static files from the 'images' and 'fonts' directories at the root level
app.use(express.static(path.join(__dirname, 'images')));  // Serve images from the root 'images' directory
app.use(express.static(path.join(__dirname, 'fonts')));   // Serve fonts from the root 'fonts' directory
app.use(express.static(path.join(__dirname, 'public')));  // Serve public assets like CSS

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
var indexRouter = require("./routes/index");
app.use("/", indexRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Vercel automatically handles the server, no need to manually define a port
module.exports = app;
