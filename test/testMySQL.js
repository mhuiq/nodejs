/**
 * Created by 80374361 on 2017/1/22.
 */

/*var db = require('mysql');
var DB = db.DB;
var BaseRow = db.Row;
var BaseTable = db.Table;*/

/*var box = new DB({
    host: '99.12.41.168',
    port: 3306,
    user: 'root',
    password: 'Midsrv@2016',
    database: 'board',
    connectionLimit: 50,
    useTransaction: {
        connectionLimit: 20
    },
    useCursor: {
        connectionLimit:1
    }
});*/

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Midsrv@2016',
    database: 'board',
    connectionLimit: 50,
    useTransaction: {
        connectionLimit: 20
    },
    useCursor: {
        connectionLimit:1
    }
});
conn.connect();
/*var baseicTest = function (cb) {
    box.connect(function (conn, cb) {
       cps.seq([
           function (_, cb) {
               conn.query('select * from MID_Meeting_T limit 1', cb);
           },
           function (res, cb) {
               console.log(res);
               cb();
           }
       ], cb);
    }, cb);
}*/
conn.query('select * from MID_Meeting_T limit 1', function (err, rows, fields) {
    if (err) {
        throw err;
    }
    console.log(rows);
});
conn.end();