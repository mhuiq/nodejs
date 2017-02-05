/**
 * Created by 80374361 on 2017/1/20.
 */

(function () {
    var jsonStr = '{"cert_token": "abcedefefe", "full_name": "hello", "id_num": "339002383002"}';
    var jsonSubject = JSON.parse(jsonStr);
    console.log(jsonSubject.cert_token);
    console.log(jsonSubject['full_name']);
})();

var globalVar = "globalVar";

var globalMethod = function () {
    console.log(this.globalVar);
};
globalMethod();

var scheduler = require('node-schedule');

// var montlyJob = scheduler.scheduleJob('1 * * * * *', function () {
//    console.log('scheduler task emit !');
// });

(function () {
    var hasVal = "你好";
    var noVal = {};
    var testVal = noVal['val'] || hasVal;
    console.log(encodeURI(testVal));

    var num = 0x7F7F7F7F;
    var buf = Buffer.alloc(4);
    buf.writeInt32BE(num);
    var hex = buf.toString('hex');
    console.log(hex);

    var tmpObj = {};
    tmpObj.nowTime = Date.now();
    setInterval(printFuncExec(tmpObj), 5000);

    setInterval(changeFuncExec(tmpObj), 1000);


})();

function printFuncExec (tmpObj) {
    return function () {
        console.log(tmpObj.nowTime);
    }
}

function changeFuncExec (tmpObj) {
    return function () {
        tmpObj.nowTime = Date.now();
    }
}