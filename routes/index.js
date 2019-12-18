var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.sendFile('index.html');
  res.json({ message: 'Welcome to the backend index' });
});

module.exports = router;
