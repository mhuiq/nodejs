/**
 * Created by 80374361 on 2017/1/19.
 */

var express = require('express');
var router = express.Router();
var ws = require('../websocket');
var certTokenManager = require('../lib/cert_token_manager');

router.post('/', function (req, res) {
    var data = '';
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        responseData = {};
        console.log('收到认证中心想认证结果：', data);
        var requestData = JSON.parse(data);
        var certToken = requestData['cert_token'];
        var certTokenMap = certTokenManager.getCertTokenMap();
        var certTokenSubject = certTokenMap[certToken];
        if (certToken === undefined || certTokenSubject.getToken().isAuthed) {
            responseData.ret_code = '4022';
            responseData.error_msg = 'token不可用';
            return ;
        }
        switch (requestData.cert_mode) {
            case 0X40:
                break;
            case 0X42:
                break;
            case 0X0F:
                break;
            case 0X4F:
                break;
        }

    })
    res.send("hello");
});

module.exports = router;