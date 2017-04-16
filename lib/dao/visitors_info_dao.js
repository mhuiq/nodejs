/**
 * Created by 80374361 on 2017/1/23.
 */

var db = require('../db_connection_factory');

const SELECT = 'SELECT IDCARD, USERNAME, IMAGEPATH, MOBILEPHONE, HOUSEID, VALIDATETIME, DURATION, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_VISITORS_INFO';

const INSERT = 'INSERT INTO authdb.TAB_VISITORS_INFO (IDCARD, USERNAME, IMAGEPATH, MOBILEPHONE, HOUSEID, VALIDATETIME, DURATION, SPC10, SPC20, SPC50, SPC100) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

const SELECTBYIDCARD = 'SELECT IDCARD, USERNAME, IMAGEPATH, MOBILEPHONE, HOUSEID, VALIDATETIME, DURATION, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_VISITORS_INFO WHERE IDCARD = ?';

const SELECTALLFORINDEX = 'SELECT T1.IDCARD, T1.USERNAME, T1.IMAGEPATH, T1.MOBILEPHONE, T2.HOUSEID, T2.HOUSEINFO, T2.HOUSEADDR, T1.VALIDATETIME, T1.DURATION FROM authdb.TAB_VISITORS_INFO T1, authdb.TAB_HOUSE_INFO T2 WHERE T1.HOUSEID = T2.HOUSEID';

const DELETEBYIDCARD = 'DELETE FROM authdb.TAB_VISITORS_INFO WHERE IDCARD = ?';

exports.queryByIdCard = function (idCard, callback) {
    db.query(SELECTBYIDCARD, [idCard], callback);
};

exports.insert = function (visitorInfo, callback) {
    db.insert(INSERT, [visitorInfo['IDCARD'], visitorInfo['USERNAME'], visitorInfo['IMAGEPATH'], visitorInfo['MOBILEPHONE'], visitorInfo['HOUSEID'], visitorInfo['VALIDATETIME'], visitorInfo['DURATION'], visitorInfo['SPC10'], visitorInfo['SPC20'], visitorInfo['SPC50'], visitorInfo['SPC100']] ,callback);
};

exports.queryAllForIndex = function (callback) {
    db.query(SELECTALLFORINDEX,[], callback);
};

exports.deleteByIdCard = function (idCard, callback) {
    db.delete(DELETEBYIDCARD, [idCard], callback);
};