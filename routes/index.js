var express = require('express');
var router = express.Router();
var JavaTest = require('../JavaTest.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  let tester = JavaTest();
  tester.runProcess(function (answer) {
    res.send(answer);
  })
});

module.exports = router;
