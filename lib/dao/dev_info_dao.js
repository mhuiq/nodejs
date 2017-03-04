/**
 * 设备信息数据库访问层
 * Created by 80374361 on 2017/1/23.
 */

var db = require('../db_connection_factory');

const SELECTBYAPPID = 'SELECT APPID, HOUSEID, APPINFO, REGISTERTIME, MOBILEPHONE, RECORDSTATUS, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_DEV_INFO where APPID = ?';

const INSERT = 'INSERT INTO authdb.TAB_DEV_INFO (APPID, HOUSEID, APPINFO, REGISTERTIME, MOBILEPHONE, RECORDSTATUS, SPC10, SPC20, SPC50, SPC100) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

const SELECTALL = 'SELECT APPID, HOUSEID, APPINFO, REGISTERTIME, MOBILEPHONE, RECORDSTATUS, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_DEV_INFO';

const SELECTFORINDEX = "SELECT T1.APPID, T2.HOUSEINFO, T1.APPINFO, T1.REGISTERTIME, T1.MOBILEPHONE FROM authdb.TAB_DEV_INFO T1, authdb.TAB_HOUSE_INFO T2 WHERE T1.HOUSEID = T2.HOUSEID AND T1.RECORDSTATUS = 'A'";

const DELETEBYAPPID = 'DELETE FROM authdb.TAB_DEV_INFO WHERE APPID = ?';

exports.queryByAppId = function (appId, callback) {
    db.query(SELECTBYAPPID, [appId], callback) ;
};

exports.insert = function (devInfo, callback) {
    db.insert(INSERT, [devInfo['APPID'], devInfo['HOUSEID'], devInfo['APPINFO'], devInfo['REGISTERTIME'],
        devInfo['MOBILEPHONE'], devInfo['RECORDSTATUS'], devInfo['SPC10'], devInfo['SPC20'],
        devInfo['SPC50'], devInfo['SPC100']], callback);
};

exports.queryAllForIndex = function (callback) {
    db.query(SELECTFORINDEX, [], callback);
};

exports.deleteById = function (appId, callback) {
    db.delete(DELETEBYAPPID, [appId], callback);
};
