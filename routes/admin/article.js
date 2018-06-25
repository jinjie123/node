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


    DB.find('article',{},function(err,data){  /*注意错误信息*/

     // console.log(data);
        res.render('admin/article/index',{
            host:Host,
            list:data
        })

    })

});

//增加新闻页面
router.get('/add', function(req, res) {
  //res.render('index', { title: 'Express' });

    res.render('admin/article/add',{
        host:Host
    })


});

//增加新闻
router.post('/doAdd', function(req, res) {

    var form = new multiparty.Form();
    form.uploadDir='./public/upload';//图片保留路径
    form.parse(req, function(err, fields, files) {  /*解析post过来的数据*/

        var title = fields.title[0];
        var add_time = fields.add_time[0];
        var face = files.face[0].path;
        var author = fields.author[0];
        var description = fields.description[0];
        var content = fields.content[0];//图文文本编辑器上传资料

        DB.insertOne('article',{
            "title":title,
            "add_time":add_time,
            "face":face,
            "author":author,
            "description":description,
            "content":content
        },function(err,data){
            if(err){
                console.log(err);
                return;
            }

            res.redirect(Host+'/admin/article');
        })


    });

});



//编辑页面
router.get('/edit', function(req, res) {
  //res.render('index', { title: 'Express' });

  var id=req.query.id;

    DB.find('article',{'_id':new DB.ObjectID(id)},function(err,data){

        res.render('admin/article/edit',{
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
        var add_time = fields.add_time[0];
        var face = files.face[0].path;
        var author = fields.author[0];
        var description = fields.description[0];
        var content = fields.content[0];//图文文本编辑器上传资料

        var originalFilename=files.face[0].originalFilename;

        if(originalFilename!=""){
            var setData={
                "title":title,
                "add_time":add_time,
                "face":face,
                "author":author,
                "description":description,
                "content":content
            }
        }else{
            var setData={
                "title":title,
                "add_time":add_time,
                "author":author,
                "description":description,
                "content":content
            }
            fs.unlink('./'+face);//删除添加的默认图片

        }

        DB.updateOne('article',{'_id':new DB.ObjectID(id)},{$set:setData},function(err,result){
            if(err){
                console.log(err);
                return;
            }
            res.redirect(Host+'/admin/article');
        })


    });

});


router.get('/delete', function(req, res) {

    var id=req.query.id;

    DB.deleteMany('article',{'_id':new DB.ObjectID(id)},function(err){
        if(err){
            console.log(err);
        }
        res.redirect(Host+'/admin/article');
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
