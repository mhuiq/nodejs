/**
 * 监控端连接器
 * Created by 80374361 on 2017/1/18.
 */
var WebSocket = require('ws');
var opcodeConstants = require('./lib/opcode_constants');
var WebSocketServer = WebSocket.Server;
var uuid = require('node-uuid');
var monitorClients = {};

//function start (server) {
function start() {
    //var wss = new WebSocketServer({server: server})
    var wss = new WebSocketServer({port: 9778})
    wss.on('connection', function (ws) {
        var monitorClientId = uuid.v4(); // 为介入的监控端生成唯一的ID
        console.log("收到客户端，分配的ID为：", monitorClientId);
        monitorClients[monitorClientId] = ws;
        ws.on('message', function (message) {
            // TODO 若监控客户端有消息过来，则进行处理
            console.log('收到监控客户端发来的消息：', message);
        });

        ws.on('close', function () {
            console.log('客户端%s已经断开连接。', monitorClientId);
            // 客户端断开连接时清理客户端数据
            if (monitorClientId === undefined || monitorClientId === '') {
                return;
            }
            removeValidClient();

        });

        removeValidClient = function () {
            if (monitorClients[monitorClientId] != undefined) {
                delete monitorClients[monitorClientId];
            }
        };

        process.on('SIGINT', function () {
            console.log("服务端关闭！");
            // TODO 向客户端发送服务端关闭信息
            process.exit();
        });
    });
}

exports.startWebsocket = start;
exports.getMonitorClients = function () {
    return monitorClients;
};

start();