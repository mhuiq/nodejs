var deviceDao = require('../lib/dao/dev_info_dao');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getAll', function(req, res, next) {
    deviceDao.queryAllForIndex(function (devInfos) {
        res.send('jsonpCallback(' + JSON.stringify(devInfos) + ')');
    })
});

router.get('/save', function (req, res, next) {
    var resultData = {};
    var devInfo = {};
    console.log(req.query)
    devInfo.APPID = req.query.appid;
    devInfo.HOUSEID = req.query.houseid;
    devInfo.APPINFO = req.query.appinfo;
    devInfo.REGISTERTIME = Date.now();
    devInfo.MOBILEPHONE = req.query.mobilephone;
    devInfo.RECORDSTATUS = 'A';
    if (devInfo.APPID === undefined || devInfo.APPID.trim().length == 0 ||
        devInfo.HOUSEID === undefined || devInfo.HOUSEID.trim().length == 0 ||
        devInfo.APPINFO === undefined || devInfo.APPINFO.trim().length == 0 ||
        devInfo.MOBILEPHONE === undefined || devInfo.MOBILEPHONE.trim().length == 0) {
        resultData.rtnCode = 'ERROR';
        resultData.rtnMsg = '数据有误！';
        res.send('jsonpCallback(' + JSON.stringify(resultData) + ')');
        return;
    }
    devInfo.SPC10 = '';
    devInfo.SPC20 = '';
    devInfo.SPC50 = '';
    devInfo.SPC100 = '';
    deviceDao.insert(devInfo, function (err) {
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
    if (req.query.appId == undefined || req.query.appId.trim().length == 0) {
        resultData.rtnCode = 'ERROR';
        resultData.rtnMsg = '数据有误！';
        res.send('jsonpCallback(' + JSON.stringify(resultData) + ')');
        return;
    }
    deviceDao.deleteById(req.query.appId.trim(), function (err) {
        resultData.rtnCode = 'SUCCESS';
        if (err) {
            resultData.rtnCode = 'ERROR';
            resultData.rtnMsg = '系统错误！';
        }
        res.send('jsonpCallback(' + JSON.stringify(resultData) + ')');
    });

});

module.exports = router;
