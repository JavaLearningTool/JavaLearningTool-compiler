'use strict';

const express = require('express');

const router = express.Router();
const JavaTest = require('../JavaTest.js');

router.post('/', function(req, res, next) {
  let tester = JavaTest();
  console.log("SRC Code: " + req.body.src);
  console.log("Challenge: " + req.body.challenge);
  
  tester.runProcess(req.body.src, req.body.challenge, function (answer) {
    console.log(answer);
    res.send(answer);
  })
});

module.exports = router;
