var houseDao = require('../lib/dao/house_info_dao');
var express = require('express');
var login = require('./login');
var app_constants = require('../lib/app_constants');
var router = express.Router();

router.use(function (req, res, next) {
    if (!login.checkLogin(req, res)) {
        var resultMap = login.getUnLoginResult();
        res.send(JSON.stringify(resultMap));
        return;
    }
    next();
});
/* GET users listing. */
router.get('/getAll', function(req, res, next) {
    houseDao.queryAll(function (houseInfos) {
        res.send(JSON.stringify(houseInfos));
    })
});

router.get('/save', function (req, res, next) {
    var resultData = {};
    var houseInfo = {};
    houseInfo.HOUSEID = req.query.houseid;
    houseInfo.HOUSEINFO = req.query.houseinfo;
    houseInfo.SCHEMEID = 0;
    houseInfo.HOUSEADDR = req.query.houseaddr;
    if (houseInfo.HOUSEID === undefined || houseInfo.HOUSEID.trim().length == 0 ||
        houseInfo.HOUSEINFO === undefined || houseInfo.HOUSEINFO.trim().length == 0 ||
        houseInfo.HOUSEADDR === undefined || houseInfo.HOUSEADDR.trim().length == 0 ) {
        resultData.rtnCode = 'ERROR';
        resultData.rtnMsg = '数据有误！';
        res.send(JSON.stringify(resultData));
        return;
    }
    houseInfo.SPC10 = '';
    houseInfo.SPC20 = '';
    houseInfo.SPC50 = '';
    houseInfo.SPC100 = '';
    houseDao.insert(houseInfo, function (err) {
        resultData.rtnCode = 'SUCCESS';
        if (err) {
            resultData.rtnCode = 'ERROR';
            resultData.rtnMsg = '系统出错！';
        }
        res.send(JSON.stringify(resultData));
    });

});

router.get('/deleteById', function (req, res, nesxt) {
    var resultData = {};
    console.log(req.query.houseid);
    if (req.query.houseid == undefined || req.query.houseid.trim().length == 0) {
        resultData.rtnCode = 'ERROR';
        resultData.rtnMsg = '数据有误！';
        res.send(JSON.stringify(resultData));
        return;
    }
    houseDao.deleteById(req.query.houseid.trim(), function (err) {
        resultData.rtnCode = 'SUCCESS';
        if (err) {
            resultData.rtnCode = 'ERROR';
            resultData.rtnMsg = '系统错误！';
        }
        res.send(JSON.stringify(resultData));
    });

});

module.exports = router;
