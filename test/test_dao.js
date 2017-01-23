/**
 * Created by 80374361 on 2017/1/23.
 */

var devInfoDao = require('../lib/dao/dev_info_dao');
var db = require('../lib/db_connection_factory');

(function () {
    var appId = 'ac:bc:32:78:56:29';
    devInfoDao.queryByAppId(appId, function (result) {
        console.log(result.length);
    });
})();

// (function () {
//     var devInfo = {};
//
//     // db.insert(INSERT, [devInfo['appId'], devInfo['houseId'], devInfo['appInfo'], devInfo['registerTime'],
//     //     devInfo['mobilePhone'], devInfo['recordStatus'], devInfo['spc10'], devInfo['spc20'],
//     //     devInfo.['spc50'], devInfo['spc100']], callback);
//     devInfo.appId = "ac:bc:32:78:56:29";
//     devInfo.houseId = '11092@XFHY';
//     devInfo.appInfo = '学府花园11092';
//     devInfo.registerTime = '1485177770632';
//     devInfo.mobilePhone = '0755-88001122';
//     devInfo.recordStatus = 'Y';
//     devInfo.spc10 = '';
//     devInfo.spc20 = '';
//     devInfo.spc50 = '';
//     devInfo.spc100 = '';
//
//
//     devInfoDao.insert(devInfo, function (result) {
//         console.log(result);
//     })
//
// })();