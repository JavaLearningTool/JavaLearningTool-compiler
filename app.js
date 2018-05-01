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
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    let error = err.message;
    error = req.app.get("env") === "development" ? err : {};

    // json error page
    res.status(err.status || 500);
    res.json({ error });
});

module.exports = app;
