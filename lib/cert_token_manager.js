/**
 * cert_token管理器
 * Created by 80374361 on 2017/1/19.
 */
var https = require('https'),
    url = require('url');
var access_token = require('access_token_manager');
var app_constants = require('app_constants');
var cert_token_factroy = require('token');
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
        });
    });
    req.end();
}

function addCertToken (app_id, ws) {
    var cert_token = new Cert_token(app_id, ws);

}
