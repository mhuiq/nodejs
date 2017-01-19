/**
 * Created by 80374361 on 2017/1/18.
 */

var assert = require('assert');
var str = "占据17个字节"
var buff = new Buffer(str, 'utf-8');
assert.equal(buff.length, 17, "预期是17个字节");
console.log(buff[1]);

var fs = require('fs');
var rs = fs.createReadStream('test.md', {highWaterMark:12});
var data = '';

rs.on('data', function (chunk) {
    console.log("读取数据");
    data += chunk;
});
rs.on('end', function () {
   console.log(data);
});