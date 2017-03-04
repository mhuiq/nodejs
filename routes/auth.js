var authDao = require('../lib/dao/auth_info_dao');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getAll', function(req, res, next) {
    authDao.queryAllForIndex(function (authInfos) {
        res.send('jsonpCallback(' + JSON.stringify(authInfos) + ')');
    })
});

router.get('/save', function (req, res, next) {
    var resultData = {};
    var authInfo = {};
    console.log(req.query)
    authInfo.IDCARD = req.query.idcard;
    authInfo.HOUSEID = req.query.houseid;
    if (authInfo.IDCARD === undefined || authInfo.IDCARD.trim().length == 0 ||
        authInfo.HOUSEID === undefined || authInfo.HOUSEID.trim().length == 0) {
        resultData.rtnCode = 'ERROR';
        resultData.rtnMsg = '数据有误！';
        res.send('jsonpCallback(' + JSON.stringify(resultData) + ')');
        return;
    }
    authInfo.SPC10 = '';
    authInfo.SPC20 = '';
    authInfo.SPC50 = '';
    authInfo.SPC100 = '';
    authDao.insert(authInfo, function (err) {
        resultData.rtnCode = 'SUCCESS';
        if (err) {
            resultData.rtnCode = 'ERROR';
            resultData.rtnMsg = '系统出错！';
        }
        res.send('jsonpCallback(' + JSON.stringify(resultData) + ')');
    });

});

router.get('/deleteById', function (req, res, nesxt) {
    var resultData = {};
    if (req.query.authid == undefined || req.query.authid.trim().length == 0) {
        resultData.rtnCode = 'ERROR';
        resultData.rtnMsg = '数据有误！';
        res.send('jsonpCallback(' + JSON.stringify(resultData) + ')');
        return;
    }
    authDao.deleteById(req.query.authid.trim(), function (err) {
        resultData.rtnCode = 'SUCCESS';
        if (err) {
            resultData.rtnCode = 'ERROR';
            resultData.rtnMsg = '系统错误！';
        }
        res.send('jsonpCallback(' + JSON.stringify(resultData) + ')');
    });

});

module.exports = router;
