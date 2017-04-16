var express = require('express');
var router = express.Router();
var ws = require('../websocket');
var UUID = require('node-uuid');
/* GET home page. */
router.get('/', function (req, res, next) {
    var cookies = req.cookies;
    console.log(cookies.sid);

    console.log("index called");
    var clients = ws.getClients();
    for (var i=0; i<clients.length; ++i) {
        var wsclient = clients[i].ws;
        wsclient.send(JSON.stringify({
            "type": "message",
            "id": clients[i].id,
            "nickname": "系统通知",
            "message": "有人访问了网站"
        }));
    }
    res.render('index', {title: 'Express'});
});

module.exports = router;
