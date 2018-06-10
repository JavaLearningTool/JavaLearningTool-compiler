require("dotenv").config();
const express = require("express");
const path = require("path");
const logger = require("./logger");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const index = require("./routes/index");

const app = express();

app.use(morgan("dev", { stream: logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("404 Not Found");
    err.status = 404;

    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // Add URL to error
    let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    err.url = fullUrl;

    logger.error("An error occurred: " + err + " " + JSON.stringify(err));

    // json error page
    res.status(err.status || 500);
    res.json({ error: err });
});

module.exports = app;
