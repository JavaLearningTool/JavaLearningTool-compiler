'use strict';

var express = require('express');
var router = express.Router();
var JavaTest = require('../JavaTest.js');

router.post('/', function (req, res, next) {
  let tester = JavaTest();
  console.log("SRC Code: " + req.body.src);
  tester.runProcess(req.body.src, function (answer) {
    console.log(answer);
    res.send(answer);
  })
});

module.exports = router;
