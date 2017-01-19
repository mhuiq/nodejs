/**
 * Created by 80374361 on 2017/1/19.
 */

var express = require('express');
var router = express.Router();
var ws = require('../websocket');

router.post('/', function (req, res) {
    var data = '';
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        console.log(data);
    })
    res.send("hello");
});

module.exports = router;