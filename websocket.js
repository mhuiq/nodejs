/**
 * �ͻ���������
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
        console.log('�ͻ��� [%s] ���ӳɹ���', appId);
        ws.send("�������ӳɹ���")

        ws.on('message', function (message) {
            // TODO ����ͻ��˷������Ľ���
        });

        ws.on('close', function () {
            certTokenManager.removeClient(appId);
        });
        process.on('SIGINT', function () {
            console.log("����˹رգ�");
            // TODO ��ͻ��˷��ͷ���˹ر���Ϣ
            process.exit();
        });
    });
}

exports.startWebsocket = start;
exports.getClients = function() {
    return clients;
}
exports.sendMsg = wsSend;