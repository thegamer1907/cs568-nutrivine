var express = require('express');
var router = express.Router();
const {preferences} = require("./../model.js");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET home page. */
router.get('/preferences', async function(req, res, next) {
  const questions = await preferences.find({});
  res.send(questions)
});

module.exports = router;
