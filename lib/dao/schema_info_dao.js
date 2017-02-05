/**
 * 策略信息数据库访问层
 * Created by 80374361 on 2017/1/23.
 */

var db = require('../db_connection_factory');

const SELECT = 'SELECT SCHEMAID, HOUSEID, MODE, SCHEMASTARTTIME, SCHEMAENDTIME, SPC10, SPC20, SPC50, SPC100 FROM authdb.tab_schema_info';

const INSERT = 'INSERT INTO authdb.tab_schema_info (HOUSEID, MODE, SCHEMASTARTTIME, SCHEMAENDTIME, SPC10, SPC20, SPC50, SPC100) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';

const SELECTBYSCHEMAID = 'SELECT SCHEMAID, HOUSEID, MODE, SCHEMASTARTTIME, SCHEMAENDTIME, SPC10, SPC20, SPC50, SPC100 FROM authdb.tab_schema_info WHERE SCHEMAID = ?';

const SELECTBYSHOUSEID = 'SELECT SCHEMAID, HOUSEID, MODE, SCHEMASTARTTIME, SCHEMAENDTIME, SPC10, SPC20, SPC50, SPC100 FROM authdb.tab_schema_info WHERE HOUSEID = ?';

exports.queryBySchemaId = function (schemaId, callback) {
    db.query(SELECTBYSCHEMAID, [schemaId], callback);
};

exports.queryByHouseId = function (houseId, callback) {
    db.query(SELECTBYSHOUSEID, [houseId], callback);
};

exports.insert = function (schemaInfo, callback) {
    db.insert(INSERT, [schemaInfo['HOUSEID'], schemaInfo['HOUSEID'], schemaInfo['MODE'], schemaInfo['SCHEMASTARTTIME'], schemaInfo['SCHEMAENDTIME'], schemaInfo['SPC10'], schemaInfo['SPC20'], schemaInfo['SPC50'], schemaInfo['SPC100']], callback);
};