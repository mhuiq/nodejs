/**
 * 房屋信息数据库访问层
 * Created by 80374361 on 2017/1/23.
 */

var db = require('../db_connection_factory');

const SELECT = 'SELECT HOUSEID, HOUSEINFO, SCHEMEID, HOUSEADDR, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_HOUSE_INFO';

const INSERT = "INSERT INTO authdb.TAB_HOUSE_INFO (HOUSEID, HOUSEINFO, SCHEMEID, HOUSEADDR, SPC10, SPC20, SPC50, SPC100) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

const SELECTBYHOUSEID = 'SELECT HOUSEID, HOUSEINFO, SCHEMEID, HOUSEADDR, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_HOUSE_INFO WHERE HOUSEID = ?';

const SELECTALL = 'SELECT HOUSEID, HOUSEINFO, SCHEMEID, HOUSEADDR, SPC10, SPC20, SPC50, SPC100 FROM authdb.TAB_HOUSE_INFO ';

const DELETEBYID = 'DELETE FROM authdb.TAB_HOUSE_INFO WHERE HOUSEID= ?';

exports.queryByHouseId = function (houseId, callback) {
    db.query(SELECTBYHOUSEID, houseId, callback);
};

exports.insert = function (houseInfo, callback) {
    db.insert(INSERT, [houseInfo['HOUSEID'], houseInfo['HOUSEINFO'], houseInfo['SCHEMEID'], houseInfo['HOUSEADDR'], houseInfo['SPC10'], houseInfo['SPC20'], houseInfo['SPC50'], houseInfo['SPC100']], callback);
};

exports.queryAll = function (callback) {
    db.query(SELECTALL, [], callback);
};

exports.deleteById = function (id, callback) {
    db.delete(DELETEBYID, id, callback);
}
