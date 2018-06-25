var express = require('express');
var router = express.Router();
var DB=require('../../model/db');
var async = require('async');
var bodyParser = require('body-parser');

//post数据
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));






router.get('/article', function(req, res, next) {

    var page=req.query.page?req.query.page:1;   /*page如果存在就是page，不存在就是1*/


    var pageSize=10;


    DB.find('article',{},{"pageSize":pageSize,"page":page}, function (err,data) {
        if(err){
            console.log(err);
            return;
        }

        res.json({"result":data,"page":page});
    })





});

router.get('/article/content', function(req, res, next) {

    //http://10.36.141.84:8000/api/article/content?aid=....
    //获取请求传过来的_id
    var aid=req.query.aid;

    DB.find('article',{'_id':new DB.ObjectID(aid)}, function (err,data) {
        if(err){
            console.log(err);
            return;
        }

        res.json({"result":data});
    })

});

/*登录*/
router.post('/login', function(req, res) {

    console.log(req.body);
    var username=req.body.username;
    var password=req.body.password;

    DB.find('user',{"username":username,"password":password}, function (err,data) {
        if(err){
            console.log(err);
            return;
        }
    //    console.log(data);
        if(data==''){
            res.json({"result":data,"success":false});
        }else{
            res.json({"result":data,"success":true});
        }
    })

});
/*注册*/

router.post('/register', function(req, res) {

   // console.log(req.body);
    var username=req.body.username;
    var password=req.body.password;

    DB.find('user',{"username":username}, function (err,data) {
        if(err){
            console.log(err);
            return;
        }
        if(data==''){

            DB.insertOne('user',{
                username,
                password
            },function(err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    res.json({"msg":'注册成功',success:true});
                }

            })


        }else{
            res.json({"msg":'注册失败',success:false});
        }
    })

});

// 搜索
router.get('/search', function(req, res, next) {

    var title = new RegExp(req.query.title)
  // console.log(title)
    DB.find('product',{'title':title}, function (err,data) {
        if(err){
            console.log(err);
            return;
        }
        console.log(data)
        res.json({"result":data});
    })

});
//商品api

router.get('/product', function(req, res, next) {


    DB.find('product',{}, function (err,data) {
        if(err){
            console.log(err);
            return;
        }

        res.json({"result":data});
    })

});


router.get('/product/content', function(req, res, next) {


    var aid=req.query.aid;

    DB.find('product',{'_id':new DB.ObjectID(aid)}, function (err,data) {
        if(err){
            console.log(err);
            return;
        }
     //   console.log(data)
        res.json({"result":data});
    })

});



/*
 *        向前台传送订单信息api
 * */
router.get('/order', function(req, res) {

    //例如：http://10.36.141.84:8000/api/order
    //data:user_id=Tom
    console.log(req.query);

    var user_id=req.query.user_id;

    DB.find('order',{"user_id":user_id}, function (err,data) {
        if(err){
            console.log(err);
            return;
        }
        console.log(data)
        res.json({"result":data,"success":"传送数据成功"});
    })

});



/*
 *
 *
 *       增加订单api
 *
 */
router.get('/order/add', function(req, res) {

    //例如：http://10.36.141.84:8000/api/order/add
    //data:user_id=Tom&product_id=milk&amount=5
    console.log(req.query);

    var user_id=req.query.user_id;
    var product_id=req.query.product_id;
    var amount=req.query.amount;
    var addtime = req.query.addtime;
   // var order_id='';
   // for(var i=0;i<13;i++) {
   //     order_id+=parseInt(Math.random()*10)
   // }

    async.parallel({

        product:function(callback){
            DB.find('product',{"_id":new DB.ObjectID(product_id)}, function (err,data) {
                if(err){
                    console.log(err);
                    return;
                }

                callback(err,data);
            })

        },
        user:function(callback){
            DB.find('user',{"_id":new DB.ObjectID(user_id)}, function (err,data) {
                if(err){
                    console.log(err);
                    return;
                }

                callback(err,data);
            })

        }


    },function(err,result){

        if(err) {
            console.log(err);
            return;
        }
        console.log(result.product);
        console.log(result.user);
        DB.insertOne('order',{
            //"order_id":order_id,
            "product_id":product_id,
            "product_title":result.product[0].title,
            "price":result.product[0].price,
            'img':result.product[0].img,
            "count":amount,
            'add_time':addtime,
            "all_price":result.product[0].price*amount,
            "status":result.user[0].status,
            "user_id":user_id,
            "username":result.user[0].username,
            "tel":result.user[0].tel,
            "address":result.user[0].address
        }, function (err,data) {
            if(err){
                console.log(err);
                return;
            }
            res.json({"result":"添加订单成功"});
        })
    })


});


/*
 *
 *         删除订单信息api
 * */
router.get('/order/delete', function(req, res) {

    //例如：http://10.36.141.84:8000/api/order/delete
    //data:user_id=Tom&product_id=milk
    //console.log(req.query);

    var user_id=req.query.user_id;
    var product_id=req.query.product_id;
    console.log(user_id);
    console.log(product_id);
    DB.deleteMany('order',{"user_id":new DB.ObjectID(user_id),"product_id":product_id}, function (err,data) {
        if(err){
            console.log(err);
            return;
        }

        res.json({"result":"删除成功"});
    })

});



module.exports = router;
