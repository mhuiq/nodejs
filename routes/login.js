/**
 * Created by Administrator on 2017/3/26 0026.
 */
var express = require('express');
var sessionManager = require('../lib/session_manager');
var app_constants = require('../lib/app_constants');
var router = express.Router();
router.get('/checklogin', function(req, res, next) {
    var resultMap = {};
    var sid = req.cookies['sid'];
    if (sessionManager.getSession(sid) === undefined) {
        resultMap = getUnLoginResult();
        resultMap['sid'] = sid;
        res.send(JSON.stringify(resultMap));
        return;
    }
    resultMap['isLogin'] = true;
    resultMap['redirectUrl'] = app_constants.index_url;
    res.send(JSON.stringify(resultMap));
    sessionManager.refreshSessionTimer(sid);
});

router.get('/refreshcerttoken', function(req, res, next) {
    console.log(req.query['certToken']);
    var resultMap = {};
    var sid = req.cookies['sid'];
    var certToken = req.query['certToken'];
    if (certToken === undefined) {
        resultMap['resultCode'] = 'error';
        res.send(JSON.stringify(resultMap));
        return ;
    }
    sessionManager.setCertToken(sid, certToken);
    resultMap['resultCode'] = 'success';
    res.send(JSON.stringify(resultMap));
});

router.get('/removecerttoken', function(req, res, next) {
    var sid = req.cookies['sid'];

});

router.get('/getloginuser', function(req, res, next) {
    var resultMap = {};
    var sid = req.cookies.sid;
    var session = sessionManager.getSession(sid);
    if (session === undefined) {
        resultMap = getUnLoginResult();
        res.send(JSON.stringify(resultMap));
        return;
    }
    resultMap['isLogin'] = true;
    // session["loginUserName"]
    // session["loginUserIdNum"]
    resultMap['loginUserName'] = session['loginUserName'];
    sessionManager.refreshSessionTimer(sid);
    res.send(JSON.stringify(resultMap));
});

function checkLogin(req, res) {
    var sid = req.cookies.sid;
    console.log(JSON.stringify(sessionManager.getSessionMap()));
    if (sessionManager.getSession(sid) === undefined) {
        return false;
    }
    sessionManager.refreshSessionTimer(sid);
    return true;
}

function getUnLoginResult() {
    var resultMap = {};
    resultMap['loginUrl'] = app_constants.login_url;
    resultMap['isLogin'] = false;
    return resultMap;
}

module.exports = router;
module.exports.checkLogin = checkLogin;
module.exports.getUnLoginResult = getUnLoginResult;
