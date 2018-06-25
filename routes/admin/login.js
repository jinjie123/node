/**
 * Created by Administrator on 2017/5/25 0025.
 */
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var md5 = require("md5-node");
var session = require("express-session");

router.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);

var DB = require("../../model/db");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
var Host = "";

router.use(function(req, res, next) {
  Host = "http://" + req.headers.host;
  next();
});

router.get("/", function(req, res) {
  res.render("admin/login", {
    host: Host
  });
});

router.post("/doLogin", function(req, res) {
  console.log(req.body);
  var username = req.body.username;
  var password = md5(req.body.password);

  DB.find("admin", { username: username, password: password }, function(
    err,
    data
  ) {
    console.log(data);
    if (err) {
      console.log(err);
      return;
    }
    if (data.length > 0) {
      session.userInfo = data[0];
      res.redirect(Host + "/admin/index");
    } else {
      res.send(
        "<script>alert('用户名或者密码错误');location.href='/admin/login'</script>"
      );
    }
  });
});

module.exports = router;
