/**
 * Created by 80374361 on 2017/2/10.
 */

/*exports.dec2Hex = function (dec) {
    var buf = Buffer.alloc(dec, 'utf-8');
    return hex;
};*/

(function () {
    var buf = Buffer.alloc(4);
    buf.write('01X1');
    console.log(String.fromCharCode(buf[0]));
    console.log(String.fromCharCode(buf[1]));
    console.log(String.fromCharCode(buf[2]));
    console.log(String.fromCharCode(buf[3]));
})();