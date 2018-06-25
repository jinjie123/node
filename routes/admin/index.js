/**
 * Created by Administrator on 2017/5/25 0025.
 */
var express = require('express');
var router = express.Router();





var Host='';

router.use(function(req, res,next){
    Host="http://"+req.headers.host;
    next();
})

router.get('/', function(req, res) {

    res.render('admin/index',{
        host:Host
    })
});




module.exports = router;
