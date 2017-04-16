var userDao = require('../lib/dao/user_info_dao');
var express = require('express');
var login = require('./login');
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
    userDao.queryAllUserInfo(function (userInfos) {
        console.log(JSON.stringify(userInfos));
        res.send(JSON.stringify(userInfos));
    });

});

router.get('/saveUser', function (req, res, next) {
    // {"IDCARD":"440481198307093911","USERNAME":"王霆","IMAGEPATH":"","MOBILEPHONE":"13500009999","SPC10":"","SPC20":"","SPC50":"","SPC100":""}
    var resultData = {};
    var userInfo = {};
    userInfo.IDCARD = req.query.idcard;
    userInfo.USERNAME = req.query.username;
    userInfo.IMAGEPATH = req.query.imagepath;
    userInfo.MOBILEPHONE = req.query.mobilephone;
    if (userInfo.IDCARD === undefined || userInfo.IDCARD.trim().length != 18 ||
        userInfo.USERNAME === undefined || userInfo.USERNAME.trim().length == 0 ||
        userInfo.MOBILEPHONE === undefined || userInfo.MOBILEPHONE.trim().length ==0) {
        resultData.rtnCode = 'ERROR';
        resultData.rtnMsg = '数据有误！';
        res.send(JSON.stringify(resultData));
        return;
    }
    userInfo.SPC10 = '';
    userInfo.SPC20 = '';
    userInfo.SPC50 = '';
    userInfo.SPC100 = '';
    userDao.insert(userInfo, function (err) {
        resultData.rtnCode = 'SUCCESS';
        if (err) {
            resultData.rtnCode = 'ERROR';
            resultData.rtnMsg = '系统出错！';
        }
        res.send(JSON.stringify(resultData));
        res.end();
    });

});

router.get('/deleteByIdCard', function (req, res, nesxt) {
    var resultData = {};
    console.log(req.query);
    if (req.query.idCard == undefined || req.query.idCard.trim().length != 18) {
        resultData.rtnCode = 'ERROR';
        resultData.rtnMsg = '数据有误！';
        res.send(JSON.stringify(resultData));
        return;
    }
    userDao.deleteByIdCard(parseInt(req.query.idCard.trim()), function (err) {
        resultData.rtnCode = 'SUCCESS';
        if (err) {
            resultData.rtnCode = 'ERROR';
            resultData.rtnMsg = '系统错误！';
        }
        res.send(JSON.stringify(resultData));
    })
});

module.exports = router;

