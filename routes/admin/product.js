var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

var fs = require('fs');

//同步查询数据库多个表数据
var async = require('async');
//post数据
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


//配置图片,获取表单信息
var multiparty = require('multiparty');


//引入Db
var DB=require('../../model/db');

var Host='';
router.use(function(req, res,next){
    Host="http://"+req.headers.host;
    next();
})

/* GET home page. */
router.get('/', function(req, res) {
    //res.render('index', { title: 'Express' });


    DB.find('product',{},function(err,data){  /*注意错误信息*/

        // console.log(data);
        res.render('admin/product/index',{
            host:Host,
            list:data
        })

    })

});

//增加商品页面
router.get('/add', function(req, res) {
    //res.render('index', { title: 'Express' });

    res.render('admin/product/add',{
        host:Host
    })


});


router.post('/doAdd', function(req, res) {

    var form = new multiparty.Form();
    form.uploadDir='./public/upload';//图片保留路径
    form.parse(req, function(err, fields, files) {  /*解析post过来的数据*/

        var title = fields.title[0];
        var old_price = fields.old_price[0];
        var img = files.img[0].path;
        var price = fields.price[0];
        var start_price = fields.start_price[0];
        var grade = fields.grade[0];
        var address = fields.address[0];
        var description = fields.description[0];
        var content = fields.content[0];//图文文本编辑器上传资料

        DB.insertOne('product',{
            "title":title,
            "old_price":old_price,
            "img":img,
            "price":price,
            "start_price":start_price,
            "grade":grade,
            'address':address,
            "description":description,
            "content":content
        },function(err,data){
            if(err){
                console.log(err);
                return;
            }

            res.redirect(Host+'/admin/product');
        })


    });

});




router.get('/edit', function(req, res) {
    //res.render('index', { title: 'Express' });

    var id=req.query.id;

    DB.find('product',{'_id':new DB.ObjectID(id)},function(err,data){

        res.render('admin/product/edit',{
            host:Host,
            list:data[0]
        })
    })


});


//执行修改操作
router.post('/doEdit', function(req, res) {

    var form = new multiparty.Form();
    form.uploadDir='./public/upload';//图片保留路径
    form.parse(req, function(err, fields, files) {

        var id = fields.id[0];

        var title = fields.title[0];
        var old_price = fields.old_price[0];
        var img = files.img[0].path;
        var price = fields.price[0];
        var start_price = fields.start_price[0];
        var grade = fields.grade[0];
        var address = fields.address[0];

        var description = fields.description[0];
        var content = fields.content[0];//图文文本编辑器上传资料

        var originalFilename=files.img[0].originalFilename;

        if(originalFilename!=""){
            var setData={
                "title":title,
                "old_price":old_price,
                "img":img,
                "price":price,
                'address':address,
                "start_price":start_price,
                "grade":grade,
                "description":description,
                "content":content
            }
        }else{
            var setData={
                "title":title,
                "old_price":old_price,
                "price":price,
                'address':address,
                "start_price":start_price,
                "grade":grade,
                "description":description,
                "content":content
            }
            fs.unlink('./'+img);//删除添加的默认图片

        }

        DB.updateOne('product',{'_id':new DB.ObjectID(id)},{$set:setData},function(err,result){
            if(err){
                console.log(err);
                return;
            }
            res.redirect(Host+'/admin/product');
        })


    });

});


router.get('/delete', function(req, res) {

    var id=req.query.id;

    DB.deleteMany('product',{'_id':new DB.ObjectID(id)},function(err){
        if(err){
            console.log(err);
        }
        res.redirect(Host+'/admin/product');
    })

});


//给编辑器提供的上传图片的接口
router.post('/upload',function(req,res){

    var form = new multiparty.Form();
    form.uploadDir='./public/upload'  /*设置图片上传的路径*/

    form.parse(req, function(err, fields, files) {

        var path=files.filedata[0].path;


        res.json({"err":"","msg":Host+'/'+path})  /*给编辑器返回地址信息*/

    });


});


module.exports = router;
