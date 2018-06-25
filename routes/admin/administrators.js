/**
 * Created by Administrator on 2017/5/26 0026.
 */
/**
 * Created by Administrator on 2017/5/25 0025.
 */
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var bodyParser = require('body-parser');
var Mongo=require('mongodb');
var ObjectID=Mongo.ObjectID;
var md5 = require('md5-node');
var DB=require('../../model/db');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var Host='';

router.use(function(req, res,next){
    Host="http://"+req.headers.host;
    next();
})

router.get('/', function(req, res) {


    DB.find('admin',{},function(err,data){

        if(err){
            console.log(err);
            return;
        }

        res.render('admin/administrators/index',{
            host:Host,
            list:data
        })
    })


});
router.get('/add',function(req,res){

    res.render('admin/administrators/add', {
        host: Host
    })

})

router.post('/doAdd',function(req,res){

    var form = new multiparty.Form();

    form.uploadDir='./public/upload'  /*设置图片上传的路径*/
    form.parse(req, function(err, fields, files) {

        var username=fields.username[0];
        var password=md5(fields.password[0]);
        var tel=fields.tel[0];
        var email=fields.email[0];
        var status=fields.status[0];
        var addtime=fields.addtime[0];
        var face=files.face[0].path;
        console.log(face)
        console.log(face)
        DB.insertOne('admin',{
            username,
            password,
            tel,
            email,
            status,
            addtime,
            face
        },function(err){
            if(err){
                console.log(err);
                return;
            }else{
                res.redirect(Host+'/admin/administrators');
            }

        })

    })


})



router.get('/edit',function(req,res){

    var id=req.query.id;
    console.log(id)
    DB.find('admin',{'_id':new ObjectID(id)},function(err,data){

        if(err){
            console.log(err);
            return;
        }
        console.log(data)
        res.render('admin/administrators/edit',{
            host:Host,
            list:data
        });
    })


})
router.post('/doEdit',function(req,res){

    var form = new multiparty.Form();

    form.uploadDir='./public/upload'  /*设置图片上传的路径*/
    form.parse(req, function(err, fields, files) {
        if(err){
            console.log(err)
        }

        var id=fields.id[0];
        var username=fields.username[0];
        var password=md5(fields.password[0]);
        var tel=fields.tel[0];
        var email=fields.email[0];
        var status=fields.status[0];
        var addtime=fields.addtime[0];
        if(files.face[0].size==0){
            var face=fields.oface[0]

        }else{
            var face=files.face[0].path
        }

        console.log(face)
        DB.updateOne('admin',{'_id':new ObjectID(id)},{
            username,
            password,
            tel,
            email,
            status,
            addtime,
            face
        },function(err){
            if(err){
                console.log(err);
                return;
            }else{
                res.redirect(Host+'/admin/administrators');
            }

        })

    })


})


router.get('/delete',function(req,res){
    var id=req.query.id;


    DB.deleteMany('admin',{'_id':new ObjectID(id)},function(err){

        if(err){
            console.log(err);
            return;
        }else{
            res.redirect(Host+'/admin/administrators');
        }

    })


})



module.exports = router;
