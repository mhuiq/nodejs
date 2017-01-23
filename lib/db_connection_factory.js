/**
 * 数据库连接管理器
 * Created by 80374361 on 2017/1/23.
 */
var mysql = require('mysql');
var config = {
    host: 'localhost',
    port: 3307, // mac 3307, window/linux 3306
    user: 'root',
    password: 'root', //Midsrv@2016
    database: 'authdb',
    connectionLimit: 50,
    useTransaction: {
        connectionLimit: 20
    },
    useCursor: {
        connectionLimit:1
    }
};

var pool = mysql.createPool(config);

exports.query = function (sql, params, callback) {
    pool.getConnection(function (err, conn) {
        console.log("发生SELECT事件，SELECT语句为：", sql);
        conn.query(sql, params, function (err, rows) {
            if (err) {
                console.log("[ SELECT ERROR ] - ", err.message);
                return;
            }
            callback(rows);
            conn.release();
        });
    });
};

exports.insert = function (sql, params, callback) {
    pool.getConnection(function (err, conn) {
        console.log("发生INSERT事件，INSERT语句为：", sql);
        conn.query(sql, params, function (err, result) {
            if (err) {
                console.log("[ INSERT ERROR ] - ", err.message);
                return;
            }
            callback(result);
            conn.release();
        })
    });
};

exports.update = function (sql, params, callback) {
    pool.getConnection(function (err, conn) {
        console.log("发生UPDATE事件，UPDATE语句为：", sql);
        conn.query(sql, params, function (err, result) {
            if (err) {
                console.log("[ UPDATE ERROR ] - ", err.message);
                return;
            }
            callback(result);
            conn.release();
        })
    });
};

exports.delete = function (sql, params, callback) {
    pool.getConnection(function (err, conn) {
        console.log("发生DELETE事件，DELETE语句为：", sql);
        conn.query(sql, params, function (err, result) {
            if (err) {
                console.log("[ DELETE ERROR ] - ", err.message);
                return;
            }
            callback(result);
            conn.release();
        })
    });
};

