/**
 * 授权信息数据库访问层
 * Created by 80374361 on 2017/1/23.
 */

var db = require('../db_connection_factory');

const SELECT = 'SELECT AUTHID, IDCARD, HOUSEID, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_AUTH_INFO';

const INSERT = 'INSERT INTO authdb.TAB_AUTH_INFO (IDCARD, HOUSEID, SPC10, SPC20, SPC50, SPC100) VALUES(?, ?, ?, ?, ?, ?)';

const SELECTBYAUTHID = 'SELECT AUTHID, IDCARD, HOUSEID, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_AUTH_INFO WHERE AUTHID = ?';

const SELECTFORINDEX = 'SELECT T1.AUTHID, T1.IDCARD, T1.HOUSEID, T2.HOUSEINFO, T2.HOUSEADDR, T3.USERNAME  FROM authdb.TAB_AUTH_INFO T1, authdb.TAB_HOUSE_INFO T2, authdb.TAB_USER_INFO T3 WHERE T1.HOUSEID = T2.HOUSEID AND T1.IDCARD = T3.IDCARD';

const DELEtEBYID = 'DELETE FROM  authdb.TAB_AUTH_INFO WHERE AUTHID = ?';

exports.queryByAuthid = function (authId, callback) {
    db.query(SELECTBYAUTHID, [authId], callback);
};

exports.insert = function (authInfo, callback) {
    db.insert(INSERT, [authInfo['IDCARD'], authInfo['HOUSEID'], authInfo['SPC10'], authInfo['SPC20'], authInfo['SPC50'], authInfo['SPC100']], callback);
};

exports.queryAllForIndex = function (callback) {
    db.query(SELECTFORINDEX, [], callback);
};

exports.deleteById = function (id, callback) {
    db.delete(DELEtEBYID, [id], callback);
}
