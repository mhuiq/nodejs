/**
 * Created by Mark on 17/3/7.
 */
var moment = require('moment');
var m = moment();

(function () {
    console.log(moment(1488902661000).format('YYYYMMDDHHmmss'));
    console.log(Date.parse(moment('20170308000421', 'YYYYMMDDHHmmss').format()));
    console.log(Date.parse('20170308000421', 'YYYYMMDDHHmmss'));
})();