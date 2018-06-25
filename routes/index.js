
var express = require('express');
var router = express.Router();

var api=require('./default/api');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

  res.send('首页模块');

});


//匹配api的路由
router.use('/api',api);


module.exports = router;
