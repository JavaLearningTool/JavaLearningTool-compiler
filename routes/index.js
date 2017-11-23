'use strict';

var express = require('express');
var router = express.Router();
var JavaTest = require('../JavaTest.js');

router.get('/', function(req, res, next) {
  console.log("Hey Yo", req.body.src);
  let tester = JavaTest();
  tester.runProcess(function (answer) {
    console.log(answer);
    res.send(answer);
  })
});

router.post('/', function (req, res, next) {
  let tester = JavaTest();
  tester.runProcess(req.body.src, function (answer) {
    console.log(answer);
    res.send(answer);
  })
});

module.exports = router;
