/**
 * 设备信息数据库访问层
 * Created by 80374361 on 2017/1/23.
 */

var db = require('../db_connection_factory');

const SELECTBYAPPID = 'SELECT APPID, HOUSEID, APPINFO, REGISTERTIME, MOBILEPHONE, RECORDSTATUS, SPC10, SPC20, SPC50, SPC100 FROM authdb.tab_dev_info where APPID = ?';

exports.queryByAppId = function (appId, callback) {
    db.query(SELECTBYAPPID, [appId], callback) ;
};
