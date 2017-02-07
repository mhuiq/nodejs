/**
 * cert_token管理器
 * Created by 80374361 on 2017/1/19.
 */
var https = require('https'),
    url = require('url');
var accessToken = require('./access_token_manager');
var appConstants = require('./app_constants');
var certTokenFactory = require('./token');
var db = require('./db_connection_factory');
var scheduler = require('node-schedule');

// 保存token与客户端的关系
var certTokenMap = {};
// 保存token与定时器的关系
var certTimerMap = {};
// 保存token与自动任务的关系(定时更换cert_token)
var certIntervalMap = {};
// 保存设备与认证策略（模式）定时器的关系（应用启动与修改策略时需要修改该项）
var modeTimerMap = {};
// 保存客户端与原始certTokenSubject的关系
var certTokenSubjectMap = {};

function CertToken(appId, mode, ws) {
    this.app_id = appId;    // 设备ID
    this.mode = mode || 0x40;       // 房屋的认证模式（房屋与设备的关系为一对一）
    this.ws = ws;
    this.token = certTokenFactory.createNewToken(5 * appConstants._1min);
};
CertToken.prototype.getAppId = function () {
    return this.app_id;
};
CertToken.prototype.getMode = function () {
    return this.mode;
};
CertToken.prototype.setMode = function (mode) {
    this.mode = mode;
};
CertToken.prototype.getWs = function () {
    return this.ws;
};
CertToken.prototype.getToken = function () {
    return this.token;
};

// 添加客户端
function addNewClient(appId, ws) {
    var certTokenSubject = new CertToken(appId, 0x40, ws);
    certTokenSubjectMap[appId] = certTokenSubject;
    process.nextTick(function (certTokenSubject) {
        return function () {
            getCertToken(appId);
        }
    });
    certIntervalMap[appId] = setInterval(certIntervalExecFun(appId));
    // 为新连接的客户端启动自动切换认证策略定时器
    startAutoChangeMode(certTokenSubject);
}

// 移除客户端
function removeClient(appId) {
    // 当客户端断开ws连接时，移除自动任务，考虑到性能原因，这里没有移除失效cert_token的定时器
    removeCertInterval(appId);
    stopAutoChangeMode(appId);
}

/*
 * 获取新的cert_token
 */
function getCertToken (appId) {
    var certTokenSubject = certTokenSubjectMap[appId];
    // 生成一个新的cert_token对象
    var curCertTokenSubject = new CertToken(certTokenSubject.getAppId(), certTokenSubject.getMode(), certTokenSubject.getWs());
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
                var ws = curCertTokenSubject.getWs();
                var clientResp = 'NSIdentifyApp://cert_token=' + response.cert_token + '&mode=' + curTokenSubject.getMode();
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

function certIntervalExecFun (appId) {
    return function () {
        getCertToken(appId);
    };
};

function startAutoChangeMode (certTokenSubject) {
    var appId = certTokenSubject.getAppId();
    var sql = "select * from TAB_SCHEMA_INFO where HOUSEID = (select HOUSERID form TAB_DEV_INFO where APPID = ？and RECORDSTATUS = 'A')";
    db.query(sql, [appId], function (schemaInfoRs) {
        var schemaInfos = [];
        for (var i=0; i<schemaInfoRs.length; ++i) {
            var schemaInfo = JSON.parse(schemaInfoRs[i]);
            var startTimeCron = schemaInfo['SCHEMASTARTTIME'];
            var endTimeCrom = schemaInfo['SCHEMAENDTIME'];
            var startSchemaJob = scheduler.scheduleJob(startTimeCron, changeMode(appId, schemaInfo['MODE']));
            var endTimeCromJob = scheduler.scheduleJob(startTimeCron, changeMode(appId, 0x40));
            var schemaJob = {};
            schemaJob.schemaId = schemaInfo['SCHEMAID'];
            schemaJob.startSchemaJob = startSchemaJob;
            schemaJob.endTimeCromJob = endTimeCromJob;
            schemaInfos.push(schemaJob);
        }
        if (schemaInfos.length != 0) {
            modeTimerMap[appId] = schemaInfos;
        }
    });
}

function stopAutoChangeMode (appId) {
    var schemaInfos = modeTimerMap[appId];
    if (schemaInfos === undefined) {
        return;
    }
    for (var i=0; schemaInfos.length; ++i) {
        var schemaJob = schemaInfos[i];
        schemaJob.startSchemaJob.cancel();
        schemaJob.endTimeCromJob.cancel();
    }
    delete modeTimerMap[appId];
}

function changeMode(appId, mode) {
    var certTokenSubject = certTokenSubjectMap[appId];
    certTokenSubject.setMode(mode);
    getCertToken(appId);
}

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

