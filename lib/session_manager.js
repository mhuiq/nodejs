/**
 * session管理器
 * Created by Administrator on 2017/3/26 0026.
 */

var appConstants = require('./app_constants');

// 保存已经登陆的用户信息
var sessionMap = {};
var sessionTimerMap = {};
var certTokenSessionMap = {};

exports.getSessionMap = function() {
    return sessionMap;
}

exports.getSession = function(sid) {
    return sessionMap[sid];
}

exports.setSession = function(sid, obj) {
    sessionMap[sid] = obj;
    refreshSessionTimer(sid);
}

function removeSession(sid) {
    var session = sessionMap[sid];
    if (session === undefined) {
        return;
    }
    delete sessionMap[sid];
}
function removeSessionTimer(sid) {
    var timerId = sessionTimerMap[sid];
    if (timerId != undefined && !timerId._called) {
        clearTimeout(timerId);
    }
}
function refreshSessionTimer(sid) {
    var timerId = sessionTimerMap[sid];
    if (timerId != undefined && !timerId._called) {
        clearTimeout(timerId);
    }
    sessionTimerMap[sid] = setTimeout(function () {
        removeSession(sid);
    }, 30 * appConstants._1min);
}
exports.removeSession = removeSession;
exports.refreshSessionTimer = refreshSessionTimer;

function setCertToken(sid, certToken) {
    certTokenSessionMap[sid] = certToken;
}

function getSessionIdByCertToken(certToken) {
    for (var key in certTokenSessionMap) {
        if (certToken === certTokenSessionMap[key]) {
            return key;
        }
    }
    return undefined;
}
function removeCertToken(sid) {
    if (certTokenSessionMap[sid] === undefined) {
        return;
    }
    delete  certTokenSessionMap[sid];
}
exports.setCertToken = setCertToken;
exports.getSessionIdByCertToken = getSessionIdByCertToken;
exports.removeCertToken = removeCertToken;
