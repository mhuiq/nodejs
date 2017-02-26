/**
 * 授权信息数据库访问层
 * Created by 80374361 on 2017/1/23.
 */

var db = require('../db_connection_factory');

const SELECT = 'SELECT AUTHID, IDCARD, HOUSEID, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_AUTH_INFO';

const INSERT = 'INSERT INTO authdb.TAB_AUTH_INFO (IDCARD, HOUSEID, SPC10, SPC20, SPC50, SPC100) VALUES(?, ?, ?, ?, ?, ?)';

const SELECTBYAUTHID = 'SELECT AUTHID, IDCARD, HOUSEID, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_AUTH_INFO WHERE AUTHID = ?';

exports.queryByAuthid = function (authId, callback) {
    db.query(SELECTBYAUTHID, [authId], callback);
};

exports.insert = function (authInfo, callback) {
    db.insert(INSERT, [authInfo['IDCARD'], authInfo['HOUSEID'], authInfo['SPC10'], authInfo['SPC20'], authInfo['SPC50'], authInfo['SPC100']], callback);
};

var insertFun = function (authInfo, callback) {
    db.insert(INSERT, [authInfo['IDCARD'], authInfo['HOUSEID'], authInfo['SPC10'], authInfo['SPC20'], authInfo['SPC50'], authInfo['SPC100']], callback);
};


//(function() {
//	var authInfo = {'IDCARD':'441723198810045270', 'HOUSEID':'11092@XFHY','SPC10':'', 'SPC20':'','SPC50':'','SPC100':''};
//	insertFun(authInfo, function(err){
//		console.log(err);
//		console.log('OK');
//	});
//})();
