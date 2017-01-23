/**
 * cert_token管理器
 * 思路：
 * 1.服务端启动时，由access_token管理器向认证中心发起是申请access_token的请求，保存申请的access_token，
 *   并启动一个定时任务setInterval()，每隔2个小时，重新申请access_token
 * 2.客户端接入，系统给客户端生成一个唯一标识号，并为之生成一个空的token对象，返回给客户端建立连接成功
 * 3.给客户端响应后，调用process.nextTick向认证中心为刚才接入的客户端申请cert_token，
 *   将cert_token 保存到cert_token_map里（key为客户端cert_token,value为token对象）
 * 4.为客户端启动一个定时任务(token对象为定时任务的入参)，定时更新cert_token，每更新一次token，则在cert_token_map
 *   加一个键值对key-value，并为该值对设定一个定时删除任务setTimeout()，函数参数为cert_token
 * 5.当客户端退出时，在cert_token_map中删除token
 * 6.当认证中心推送认证结果过来时，首先在cert_token_map中查找是否存在cert_token，若不存在，则返回给认证中心错误，
 *   若存在，则判断是否过期，若没有过期，返回给认证中心认证成功，标识该token认证通过，并推送到客户端认证成功信息
 * 7.认证成功后，需要取消该客户端启用的定时任务
 * ，
 * Created by 80374361 on 2017/1/19.
 */
var https = require('https'),
    url = require('url');
var accessToken = require('./access_token_manager');
var appConstants = require('./app_constants');
var certTokenFactory = require('./token');

// 保存token与客户端的关系
var certTokenMap = {};
// 保存token与定时器的关系
var certTimerMap = {};
// 保存token与自动任务的关系
var certIntervalMap = {};

function CertToken(appId, ws) {
    this.app_id = appId;
    this.ws = ws;
    this.token = certTokenFactory.createNewToken(5 * appConstants._1min);
};
CertToken.prototype.getAppId = function () {
    return this.app_id;
};
CertToken.prototype.getWs = function () {
    return this.ws;
};
CertToken.prototype.getToken = function () {
    return this.token;
};

// 添加客户端
function addNewClient(appId, ws) {
    var certTokenSubject = new CertToken(appId, ws);
    process.nextTick(function (certTokenSubject) {
        return function () {
            getCertToken(certTokenSubject);
        }
    });
    certIntervalMap[appId] = setInterval(certIntervalExecFun(certTokenSubject));
}

// 移除客户端
function removeClient(appId) {
    // 当客户端断开ws连接时，移除自动任务，考虑到性能原因，这里没有移除失效cert_token的定时器
    removeCertInterval(appId);
}

/*
 * 获取新的cert_token
 */
function getCertToken (certTokenSubject) {
    // 生成一个新的cert_token对象
    var curCertTokenSubject = new CertToken(certTokenSubject.getAppId(), certTokenSubject.getWs());
    var curTokenSubject = curCertTokenSubject.getToken();
    var getOptions = url.parse(appConstants.getcerttoken_url + "?access_token=" + accessToken.getAccessToken().getCurToken());
    getOptions.method = 'GET';
    // 向认证中心获取cert_token
    var req = https.request(getOptions, function (res) {
        var data = '';
        res.setEncoding('utf-8');
        res.on('data', function (buffer) {
            data += buffer;
        });
        res.on('end', function () {
            var response = JSON.parse(data);
            if (response.ret_code === 0) {
                curTokenSubject.refreshToken(response['cert_token'], Date.now());
                certTokenMap[response['cert_token']] = curCertTokenSubject;
                certTimerMap[response['cert_token']] = setTimeout(certTimerExecFun(response.cert_token), 5 * appConstants._1min);
                // TODO 将新的cert_token推送到客户端，认证模式先写死0x40 简单模式
                var ws = curCertTokenSubject.getWs();
                var clientResp = 'NSIdentifyApp://cert_token=' + response.cert_token + '&mode=0x40';
                ws.send(clientResp)
            } else {
                console.log("获取%s的cert_tocken出错了！错误原因为%s", curCertTokenSubject.getAppId(), response.error_msg);
            }
        });
    });
    req.end();
}

// 删除定时器
function removeTimer (certToken) {
    var timerId = certTimerMap[certToken];
    if (timerId === undefined) {
        return ;
    }
    console.log("_called", timerId._called);
    if (!timerId._called) {
        // 若定时器还没执行，则进行清除
        clearTimeout(timerId);
    }
    delete certTimerMap[certToken];
}

// 删除token
function removeCertTokenFromTokenMap (certToken) {
    var token_subject = certTokenMap[certToken];
    if (token_subject === undefined) {
        return;
    }
    delete certTokenMap[certToken];
}

// 删除自动任务（用户退出，用户认证成功的时候需要删除自动任务）
function removeCertInterval (appId) {
    var intervalId = certIntervalMap[appId];
    if (intervalId === undefined) {
        return ;
    }
    clearInterval(intervalId);
    delete certIntervalMap[appId];
}

// 定期清理无效token函数
function certTimerExecFun (certToken) {
    return function () {
        removeCertTokenFromTokenMap(certToken);
        removeTimer(certToken);
    }
}

function certIntervalExecFun (certTokenSubject) {
    return function () {
        getCertToken(certTokenSubject);
    };
};

exports.createCertToken = function (appId, ws) {
    return new CertToken(appId, ws);
};

exports.removeCertInterval = removeCertInterval;

exports.removeCertInterval = removeCertInterval;

exports.getCertTokenMap = function () {
    return certTokenMap;
}
exports.getCertTimerMap = function () {
    return certTimerMap;
}
exports.getCertIntervalMap = function () {
    return certIntervalMap;
}
exports.addNewClient = addNewClient;
exports.removeClient = removeClient;

/*function sayHello (msg) {
    return function () {
        console.log("sayHello的消息",msg);
        removeTimer (msg);
        console.log("sayHello结束");
        console.log("sayHello  timeId:", certTimerMap[msg]);
    }
};

(function () {
    var msg = "hello world";
    console.log("开始定时器");
    certTimerMap[msg] = setTimeout(sayHello(msg), 1000);
    console.log("timeId is called ?:", certTimerMap[msg]._called);
    if (!certTimerMap[msg]._called) {
        console.log("timeId:", certTimerMap[msg]);
    }

})();*/

