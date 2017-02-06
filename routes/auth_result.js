/**
 * Created by 80374361 on 2017/1/19.
 */

var express = require('express');
var router = express.Router();
var ws = require('../websocket');
var certTokenManager = require('../lib/cert_token_manager');
var db = require('../lib/db_connection_factory');

router.post('/', function (req, res) {
    var data = '';
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        var responseData = {};
        console.log('收到认证中心想认证结果：', data);
        var requestData = JSON.parse(data);
        var certToken = requestData['cert_token'];
        var certTokenMap = certTokenManager.getCertTokenMap();
        var certTokenSubject = certTokenMap[certToken];
        if (certTokenSubject === undefined || certTokenSubject.getToken().isAuthed) {
            responseData.ret_code = '4022';
            responseData.error_msg = 'token不可用';
            res.send(JSON.stringify(requestData));
            return ;
        }
        var fullName = requestData['full_name'];
        var idNum = requestData['id_num'];
        var certRes = requestData['cert_res'];
        var certMode = requestData['cert_mode'];
        // 根据appId找到房屋Id，根据房屋id找到所有的授权用户信息
        var appId = certTokenSubject.getAppId();
        var sql = "select * from tab_auth_info where HOUSEID = (select t1.houseid from tab_dev_info t1 where t1.APPID = 'D92E3FFD-045A-45B4-BA92-CEECDC9FE745' and t1.RECORDSTATUS = 'Y') and IDCARD = ?";
        db.query(sql, [appId, idNum], function (authInfoRs) {
            if (authInfoRs.length < 1) {

            }
        })
        switch (certMode) {
            case 0X40:
                // TODO 认证姓名+身份证号码进行身份认证
                break;
            case 0X42:
                // TODO 姓名+身份证号码+人像进行身份认证
                break;
            case 0X0F:
                // TODO 使用DN＋网上副本＋人像进行身份认证
                break;
            case 0X4F:
                // TODO 使用姓名+身份证号码＋网上副本＋人像进行身份认证
                break;
        }

    })
    res.send("hello");
});

module.exports = router;
