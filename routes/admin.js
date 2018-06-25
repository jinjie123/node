/**
 * Created by Administrator on 2017/5/26 0026.
 */

var express = require('express');
var router = express.Router();
var index = require('./admin/index');
var login = require('./admin/login');

//var order = require('./admin/order-list');

var article = require('./admin/article');
var user = require('./admin/user');

var product = require('./admin/product');

var administrators = require('./admin/administrators');

/* GET home page. */
var session = require("express-session");


router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));



router.use('/index',index );
router.use('/login',login );

router.use('/administrators',administrators );

//router.use('/order-list',order );
router.use('/article',article );
router.use('/product',product);
router.use('/user',user);

router.use('/public',express.static('public'))
module.exports = router;
