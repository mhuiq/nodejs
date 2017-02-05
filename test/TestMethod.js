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
(function () {
    var hasVal = "你好";
    var noVal = {};
    var testVal = noVal['val'] || hasVal;
    console.log(encodeURI(testVal));

    var num = 0x7FFFFFFF;
    var buf = Buffer.alloc(4);
    buf.writeInt32BE(num);
    var hex = buf.toString('hex');
    console.log(hex);
})();
