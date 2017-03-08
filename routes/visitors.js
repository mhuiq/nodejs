var visitorsDao = require('../lib/dao/visitors_info_dao');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getAll', function(req, res, next) {
    visitorsDao.queryAllForIndex(function (visitorInfos) {
        res.send('jsonpCallback(' + JSON.stringify(visitorInfos) + ')');
    })
});

router.get('/save', function (req, res, next) {
    var resultData = {};
    var visitorInfo = {};
    console.log(req.query)
    visitorInfo.IDCARD = req.query.idcard;
    visitorInfo.USERNAME = req.query.username;
    visitorInfo.HOUSEID = req.query.houseid;
    visitorInfo.VALIDATETIME = req.query.validatetime;
    visitorInfo.DURATION = req.query._duration;
    if (visitorInfo.IDCARD === undefined || visitorInfo.IDCARD.trim().length == 0 ||
        visitorInfo.USERNAME === undefined || visitorInfo.USERNAME.trim().length == 0 ||
        visitorInfo.HOUSEID === undefined || visitorInfo.HOUSEID.trim().length == 0 ||
        visitorInfo.VALIDATETIME === undefined || visitorInfo.VALIDATETIME.trim().length == 0 ||
        visitorInfo.DURATION === undefined || visitorInfo.DURATION.trim().length == 0 || visitorInfo.DURATION == 0) {
        resultData.rtnCode = 'ERROR';
        resultData.rtnMsg = '数据有误！';
        res.send('jsonpCallback(' + JSON.stringify(resultData) + ')');
        return;
    }
    visitorInfo.SPC10 = '';
    visitorInfo.SPC20 = '';
    visitorInfo.SPC50 = '';
    visitorInfo.SPC100 = '';
    visitorsDao.insert(visitorInfo, function (err) {
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
    visitorsDao.deleteById(req.query.authid.trim(), function (err) {
        resultData.rtnCode = 'SUCCESS';
        if (err) {
            resultData.rtnCode = 'ERROR';
            resultData.rtnMsg = '系统错误！';
        }
        res.send('jsonpCallback(' + JSON.stringify(resultData) + ')');
    });

});

module.exports = router;
