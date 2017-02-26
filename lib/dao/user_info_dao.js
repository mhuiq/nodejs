/**
 * Created by 80374361 on 2017/1/23.
 */

var db = require('../db_connection_factory');

const SELECT = 'SELECT IDCARD, USERNAME, IMAGEPATH, MOBILEPHONE, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_USER_INFO';

const INSERT = 'INSERT INTO authdb.TAB_USER_INFO (IDCARD, USERNAME, IMAGEPATH, MOBILEPHONE, SPC10, SPC20, SPC50, SPC100) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';

const SELECTBYIDCARD = 'SELECT IDCARD, USERNAME, IMAGEPATH, MOBILEPHONE, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_USER_INFO WHERE IDCARD = ?';

const SELECTALL = ''SELECT IDCARD, USERNAME, IMAGEPATH, MOBILEPHONE, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_USER_INFO';

exports.queryByIdCard = function (idCard, callback) {
    db.query(SELECTBYIDCARD, [idCard], callback);
}

exports.insert = function (userInfo, callback) {
    db.insert(INSERT, [userInfo['IDCARD'], userInfo['USERNAME'], userInfo['IMAGEPATH'], userInfo['MOBILEPHONE'], userInfo['SPC10'], userInfo['SPC20'], userInfo['SPC50'], userInfo['SPC100']] ,callback);
};

exports.queryAllUserInfo = function (callback) {

}