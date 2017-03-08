/**
 *
 * Created by Mark on 17/1/16.
 */

var express = require('express');
var app = express();
app.get('/', function(req, res) {
    console.log(req.param('hello'));
    res.send('hello world!');
});

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('应用实例，访问地址为：http://%s:%s', host, port);
})
