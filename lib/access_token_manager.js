/**
 * Created by 80374361 on 2017/1/19.
 * access_token管理器
 */
var https = require('https'),
    url = require('url');
var app_constants = require('./app_constants');

var accessTokenFactory = require('./token');
var accessToken = accessTokenFactory.createNewToken(2 * 60 * app_constants._1min);

function initAccessToken() {
    var get_option = url.parse(app_constants.getaccesstoken_url + "?client_id=" + app_constants.client_id + "&client_secret=" + app_constants.client_secret);
    get_option.method = 'GET';
    var req = https.request(get_option, function (res) {
        res.setEncoding('utf-8');
        res.on('data', function (buffer) {
            var response = JSON.parse(buffer.toString());
            if (response.ret_code == 0) {
                accessToken.refreshToken(response.access_token, Date.now());
                setInterval(refreshAccessToken);
            } else {
                console.log("更新access_token失败");
            }
            console.log(accessToken.getCurToken());
        })
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
                accessToken.refreshToken(response.access_token, Date.now());
            }
            console.log(accessToken.getCurToken());
        })
    });
    req.end();
};

exports.getAccessToken = function () {
    return accessToken;
};

exports.initAccessToken = initAccessToken;

exports.refreshAccessToken = refreshAccessToken;