var express = require('express');
var app = express();
var router = express.Router();
var jwt = require('jsonwebtoken');
var session = require('express-session');
var db = require("../config/db");
var users = require("../config/user");
var map = require("../config/map");
var cookieParser = require('cookie-parser');
var expressJwt = require('express-jwt');
var token = require('./token');

exports.list = function(req, res) {
    users.query("select * from user", function(err, rows) {
        if (err) {
            res.send("error");
        } else {
            res.send(rows);
        }
    });
};

exports.authenticate = function(req, res) {
    var login_user = req.body.user;
    var sql = 'SELECT * FROM user WHERE name = "' + login_user.username + '" AND password = "' + login_user.password + '"'
    users.query(sql, function(err, rows) {
        if (err) {
            res.send('账号或密码错误！');
        } else {
            res.send(token.createToken({ name: login_user.username, password: login_user.password }, 3000));
        }
    });
};

exports.register = function(req, res) {
    var add_user = req.body.user;
    var imgurl = 'public/images/myicon/logo.png';
    var add = "insert into user(name,password,myicon) values('" + add_user.name + "','" + add_user.password + "','" + imgurl + "')";
    users.query('SELECT * FROM user WHERE name = "' + add_user.name + '";', function(err, rows, fields) {
        if (rows.length == 0) {
            users.query(add, function(err, docs) {
                if (err) {
                    res.send('error');
                } else {
                    res.send('注册成功');
                }
            });
        } else {
            res.send('用户名已存在！');
        }
    })
};

exports.map_info = function(req, res) {
    // var sql='SELECT * FROM user WHERE name = "' + login_user.username + '" AND password = "' + login_user.password + '"'
    map.query('select * from map', function(err, rows) {
        if (err) {
            res.send('error');
        } else {
            res.send(rows);
        }
    });
};
exports.myIcon = function(req, res) {
    var tokeninfo = req.body.token;
    var user = token.decodeToken(tokeninfo);
    var name = user.payload.data.name;
    users.query('SELECT * FROM user WHERE name = "' + name + '";', function(err, rows, fields) {
        var imgpath = 'https://raw.githubusercontent.com/cyl0211/images/master/' + rows[0].myicon;
        res.send(imgpath);
        //     // var content =  fs.readFileSync(imgpath,"binary");
        //     // res.send(content,"binary");
    });
}
// select a JOIN b JOIN C ON a.id=b.aid AND c.id=b.cid 
exports.imgUpload = function(req, res) {
    var tokeninfo = req.body.token;
    var path = req.file.path;

    function urlPathToData(url_path) {
        var data = url_path.replace(/\\/g, '/');
        return data;
    }

    path = urlPathToData(path);
    if (token) {
        var user = token.decodeToken(tokeninfo);
        var name = user.payload.data.name;
        var sql = 'update user set myicon = "' + path + '" where name=  "' + name + '"';
        users.query(sql, function(err, rows) {
            res.send(path);
        });
    } else {
        res.send('请先登录');
    }
};
exports.collect_pit = function(req, res) {
    var tokeninfo = req.query.token;
    var user = token.decodeToken(tokeninfo);
    var name = user.payload.data.name;
    // console.log(name);
    // res.send(name);
    users.query('SELECT * FROM collect WHERE name = "' + name + '";', function(err, rows, fields) {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
};