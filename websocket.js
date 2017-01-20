/**
 * 客户端连接器
 * Created by 80374361 on 2017/1/18.
 */
var WebSocket = require('ws');
var uuid = require('node-uuid');
var certTokenManager = require('./lib/cert_token_manager');
var WebSocketServer = WebSocket.Server;
var clients = [];

function start () {
    var wss = new WebSocketServer({port: 8181})
    wss.on('connection', function (ws) {
        var appId = uuid.v4();
        certTokenManager.addNewClient(appId, ws);
        clients.push({"id": appId, "ws": ws});
        console.log('客户端 [%s] 连接成功！', appId);
        ws.send("建立连接成功！")

        ws.on('message', function (message) {
            // TODO 处理客户端发过来的交易
        });

        ws.on('close', function () {
            certTokenManager.removeClient(appId);
        });
        process.on('SIGINT', function () {
            console.log("服务端关闭！");
            // TODO 向客户端发送服务端关闭信息
            process.exit();
        });
    });
}

exports.startWebsocket = start;
exports.getClients = function() {
    return clients;
}
exports.sendMsg = wsSend;