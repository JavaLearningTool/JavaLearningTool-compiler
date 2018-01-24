'use strict';

const express = require('express');

const router = express.Router();
const JavaTest = require('../JavaTest.js');
const tester = JavaTest();
const logger = require('../logger.js');

router.post('/', function(req, res, next) {
  logger.debug("SRC Code: " + req.body.src);
  logger.debug("Challenge: " + req.body.challenge);
  
  tester.addProcess(req.body.src, req.body.challenge, function (answer) {
    logger.debug(answer);
    res.send(answer);
  });
});

module.exports = router;
