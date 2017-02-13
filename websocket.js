/**
 * 客户端连接器
 * Created by 80374361 on 2017/1/18.
 */
var WebSocket = require('ws');
var devInfoDao = require('./lib/dao/dev_info_dao');
var certTokenManager = require('./lib/cert_token_manager');
var opcodeConstants = require('./lib/opcode_constants');
var WebSocketServer = WebSocket.Server;
var validClients = [];

function start () {
    var wss = new WebSocketServer({port: 8181})
    wss.on('connection', function (ws) {
        var appId = "";
        console.log('客户端连接成功！');
        ws.send(JSON.stringify({"opcode": "connection","rtncode": "sucess", "errmsg":"建立连接成功"}));
        ws.on('message', function (message) {
            // TODO 处理客户端发过来的交易
            var reqParams = JSON.parse(message);
            var opcode = reqParams['opcode'];
            switch (opcode) {
                case opcodeConstants.gentoken:
                    appId = reqParams['devid'];
                    console.log("收到客户端申请cert_token请求，客户端设备号为：", appId);
                    devInfoDao.queryByAppId(appId, function (result) {
                        // 判断该appId是否有效
                        if (result.length != 0) {
                            certTokenManager.addNewClient(appId, ws);
                            validClients.push({"appId": appId, "ws": ws});
                        }
                    });
                    break;

                default :
                    break;
            }
        });

        ws.on('close', function () {
            // 客户端断开连接时清理客户端数据
            if (appId === "") {
                return ;
            }
            certTokenManager.removeClient(appId);
            removeValidClient();
            console.log('客户端%s已经断开连接。', appId);
        });

        removeValidClient = function () {
            for (var i=0; i<validClients.length; ++i) {
                if (validClients[i].appId === appId) {
                    validClients.splice(i, 1);
                    return;
                }
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
exports.getClients = function() {
    return validClients;
};