/**
 * Created by Mark on 17/1/20.
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('tmp.db');

/*db.serialize(function () {
    db.run("drop table user");
    db.run("CREATE TABLE USER (USERID TEXT)");

});*/

(function () {
    /*var stmt = db.prepare("INSERT INTO USER (USERID) VALUES (?)");
    for (var i=0; i<10; ++i) {
        stmt.run("UserID " + i);
    }
    stmt.finalize();*/

    db.run("BEGIN");
    var stmt = db.prepare("INSERT INTO USER (USERID) VALUES (?)");
    for (var i=10; i<11; ++i) {
        stmt.run("UserID " + i);
    }
    stmt.finalize();

    /*db.each("select rowid as id, userid from user", function (err, row) {
        // 由于这是一个异步操作，调用方的事务不会延伸到这
        if (row.id === 1) {
            console.log("在同一个事务里查询到的结果：");
        }
        console.log(row);
    });*/
    db.run("ROLLBACK");

    setTimeout(function () {
        db.each("select rowid as id, userid from user", function (err, row) {
            if (row.id === 1) {
                console.log("ROLLBACK以后的结果：");
            }
            console.log(row);
        });
    }, 7000);
})();
