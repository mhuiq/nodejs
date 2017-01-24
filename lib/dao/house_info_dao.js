/**
 * 房屋信息数据库访问层
 * Created by 80374361 on 2017/1/23.
 */

var db = require('../db_connection_factory');

const SELECT = 'SELECT HOUSEID, HOUSEINFO, SCHEMEID, HOUSEADDR, SPC10, SPC20, SPC50, SPC100 FROM authdb.tab_house_info';

const INSERT = 'INSERT INTO authdb.tab_house_info (HOUSEID, HOUSEINFO, SCHEMEID, HOUSEADDR, SPC10, SPC20, SPC50, SPC100) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';

const SELECTBYHOUSEID = 'SELECT HOUSEID, HOUSEINFO, SCHEMEID, HOUSEADDR, SPC10, SPC20, SPC50, SPC100 FROM authdb.tab_house_info WHERE HOUSEID = ?';


exports.queryByHouseId = function (houseId, callback) {
    db.query(SELECTBYHOUSEID, houseId, callback);
};

exports.insert = function (houseInfo, callback) {
    db.insert(INSERT, [houseInfo['HOUSEID'], houseInfo['HOUSEINFO'], houseInfo['SCHEMEID'], houseInfo['SPC10'], houseInfo['SPC20'], houseInfo['SPC50'], houseInfo['SPC100']], callback);
};