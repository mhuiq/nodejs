/**
 * cert_token管理器
 * Created by 80374361 on 2017/1/19.
 */
var https = require('https'),
    url = require('url');
var access_token = require('./access_token_manager');
var app_constants = require('./app_constants');
var cert_token_factroy = require('./token');
var cert_token_map = {};
function Cert_token(app_id, ws) {
    this.app_id = app_id;
    this.ws = ws;
    this.token = cert_token_factroy.createNewToken(5 * app_constants._1min);
};
Cert_token.prototype.getAppId = function () {
    return this.app_id;
};
Cert_token.prototype.getWs = function () {
    return this.ws;
};
Cert_token.prototype.getToken = function () {
    return this.token;
};

function getCertToken (cert_token) {
    var token_subject = cert_token.getToken();
    var cur_token = token_subject.getCurToken();
    var get_option = url.parse(app_constants.getcerttoken_url + "?access_token=" + access_token.getAccessToken().getCurToken());
    get_option.method = 'GET';
    var req = https.request(get_option, function (res) {
        var data = '';
        res.setEncoding('utf-8');
        res.on('data', function (buffer) {
            data += buffer;
        });
        res.on('end', function () {
            var response = JSON.parse(data);
            if (response.ret_code === 0) {
                var t = cert_token_map[cur_token];
                if (t != undefined) {
                    t.refreshToken(response.cert_token, Date.now());
                } else {
                    token_subject.refreshToken()
                }
            } else {
                console.log("获取%s的cert_tocken出错了！错误原因为%s", cert_token.getAppId(), response.error_msg);
            }
        });
    });
    req.end();
}

function addCertToken (app_id, ws) {
    var cert_token = new Cert_token(app_id, ws);

}

// 思路：
// 1.服务端启动时，由access_token管理器向认证中心发起是申请access_token的请求，保存申请的access_token，
//   并启动一个定时任务setInterval()，每隔2个小时，重新申请access_token
// 2.客户端接入，系统给客户端生成一个唯一标识号，并为之生成一个空的token对象，返回给客户端建立连接成功
// 3.给客户端响应后，调用process.nextTick向认证中心为刚才接入的客户端申请cert_token，
//   将cert_token 保存到cert_token_map里（key为客户端cert_token,value为token对象）
// 4.为客户端启动一个定时任务(token对象为定时任务的入参)，定时更新cert_token，每更新一次token，则在cert_token_map
//   加一个键值对key-value，并为该键值对设定一个定时删除任务setTimeout()，函数参数为cert_token
// 5.当客户端退出时，在cert_token_map中删除token
// 6.当认证中心推送认证结果过来时，首先在cert_token_map中查找是否存在cert_token，若不存在，则返回给认证中心错误，
//   若存在，则判断是否过期，若没有过期，返回给认证中心认证成功，标识该token认证通过，并推送到客户端认证成功信息
// 7.认证成功后，需要取消该客户端启用的定时任务，


// cert_token更新策略
// 以cert_token为key,
