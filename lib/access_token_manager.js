/**
 * Created by 80374361 on 2017/1/19.
 * access_token管理器
 */
var https = require('https'),
    url = require('url');
var app_constants = require('./app_constants');

var accessTokenFactory = require('./token');
var accessToken = accessTokenFactory.createNewToken(2 * 60 * app_constants._1min);
// var accessToken = accessTokenFactory.createNewToken(app_constants._1min);
var retryTimes = 0;

function initAccessToken() {
    var get_option = url.parse(app_constants.getaccesstoken_url + "?client_id=" + app_constants.client_id + "&client_secret=" + app_constants.client_secret);
    get_option.method = 'GET';
    var req = https.request(get_option, function (res) {
        res.setEncoding('utf-8');
        res.on('data', function (buffer) {
            var response = JSON.parse(buffer.toString());
            if (response.ret_code == 0) {
                retryTimes = 0;
                accessToken.refreshToken(response.access_token, Date.now());
                setInterval(refreshAccessToken, 2 * 60 * app_constants._1min);
                // setInterval(refreshAccessToken, app_constants._1min);
                console.log('成功获取accessToken', accessToken.getCurToken());
            } else {
                console.error('获取accessToken失败，认证服务端返回错误吗为：', response.ret_code);
                console.log('正在重新获取accessToken');
                setTimeout(initAccessToken, (++retryTimes) * app_constants.waitSeconds);
            }

        });
    });
    req.on('error', function (err) {
        console.error('初始化access_token失败！原因为: ', err);
        console.log('正在尝试第%s次重试获取access_token', ++retryTimes);
        setTimeout(initAccessToken, retryTimes * app_constants.waitSeconds);
    });
    req.end();
};

function refreshAccessToken() {
    var get_option = url.parse(app_constants.refreshaccesstoken_url + "?access_token=" + accessToken.getCurToken());
    get_option.method = 'GET';
    var req = https.request(get_option, function (res) {
        res.setEncoding('utf-8');
        res.on('data', function (buffer) {
            var response = JSON.parse(buffer.toString());
            if (response.ret_code == 0) {
                retryTimes = 0;
                accessToken.refreshToken(response.access_token, Date.now());
                console.log(accessToken.getCurToken());
            } else {
                console.error('更新accessToken失败，认证服务端返回错误吗为：', response.ret_code);
                console.log('正在重新获取accessToken');
                // 若认证服务器返回跟心accessToken失败，则重新获取
                setTimeout(initAccessToken, (++retryTimes) * app_constants.waitSeconds);
            }

        })
    });
    req.on('error', function (err) {
        console.error('更新access_token失败！原因为: ', err);
        console.log('正在尝试第%s次重试更新access_token', ++retryTimes);
        // 若因为网络原因获取accessToken失败，则一直重试
        setTimeout(refreshAccessToken, retryTimes * app_constants.waitSeconds);
    });
    req.end();
};

exports.getAccessToken = function () {
    return accessToken;
};

exports.initAccessToken = initAccessToken;

exports.refreshAccessToken = refreshAccessToken;

// (function () {
//     var req = {};
//     req.cert_token = '4eb935a3-f18d-4226-818f-29f70d46bb79';
//     req.full_name = '张佳';
//     req.id_num = '558998198709078899';
//     req.cert_res = 0;
//     req.cert_mode = 0X42;
//     console.log(JSON.stringify(req));
// })();
