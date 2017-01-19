/**
 * Created by 80374361 on 2017/1/19.
 */

var http = require('http');
var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('handled by child, pid is ' + process.pid + '\n');
    throw new Error('throw exception');
});
var worker;
process.on('message', function (m, tcp) {
    console.log('子进程收到消息;', m);
    if (m === 'server') {
        worker = tcp;
        worker.on('connection', function (socket) {
            server.emit('connection', socket);
        });
    }
});

process.on('uncaughtException', function (err) {
    process.send({act:'suicide'});
    worker.close(function () {
        process.exit(1);
    });
});
