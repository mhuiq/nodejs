/**
 * 设备信息数据库访问层
 * Created by 80374361 on 2017/1/23.
 */

var db = require('../db_connection_factory');

const SELECTBYAPPID = 'SELECT APPID, HOUSEID, APPINFO, REGISTERTIME, MOBILEPHONE, RECORDSTATUS, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_DEV_INFO where APPID = ?';

const INSERT = 'INSERT INTO authdb.TAB_DEV_INFO (APPID, HOUSEID, APPINFO, REGISTERTIME, MOBILEPHONE, RECORDSTATUS, SPC10, SPC20, SPC50, SPC100) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

exports.queryByAppId = function (appId, callback) {
    db.query(SELECTBYAPPID, [appId], callback) ;
};

exports.insert = function (devInfo, callback) {
    db.insert(INSERT, [devInfo['appId'], devInfo['houseId'], devInfo['appInfo'], devInfo['registerTime'],
        devInfo['mobilePhone'], devInfo['recordStatus'], devInfo['spc10'], devInfo['spc20'],
        devInfo['spc50'], devInfo['spc100']], callback);
};
