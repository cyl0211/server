var express = require('express');
var app = express();
var router = express.Router();
var dailydb = require("../config/dailydb");
var users = require("../config/user");
var token = require('./token');
var fs = require('fs');
var image = require("imageinfo");

exports.daily_pit = function(req, res) {
    // fs.readFile('D:/各科作业文件/毕设/个人资料/my/pubilc/images/dailygallery/','binary',function(err,data){
    // 	if(err){
    // 		res.send(err+'12');
    // 	}else{
    // 		res.send(data,'binary');
    // 	}

    // });
    dailydb.query("select * from dailypitrue", function(err, rows) {
        if (err) {
            res.send("error");
        } else {
            // res.send(rows);
            for(var i=0;i<rows.length;i++){
            	rows[i].painting_url = 'D:/各科作业文件/毕设/个人资料/my/' + rows[i].painting_url;
            }
            
            res.send(rows);
            // var content = fs.readFileSync(imgpath);
            // var base64Str = content.toString('base64');
            // var dataurl = 'data:image/png;base64,' + base64Str;
            // // console.log(dataurl);
            // res.send(dataurl);
            // res.end("");
        }
    });
};
exports.daily_collect = function(req, res) {
    var tokeninfo = req.body.token;
    var user = token.decodeToken(tokeninfo);
    var name = user.payload.data.name;

    var pit = req.body.pit;
    var idArr = [name, pit.painting_name];
    var id = idArr.join('.');
    var add = "insert into collect(id,name,painting_name,painting_artist,painting_url) values('" + id + "','" + name + "','" + pit.painting_name + "','" + pit.painting_artist + "','" + pit.painting_url + "')";
    users.query(add, function(err, rows) {
        if (err) {
            res.send(err);
        } else {
            res.send('收藏成功');
        }
    });
};