/**
 * Created by Mark on 17/1/17.
 */
var response = {};
var util = require('util');
    https = require('https');
    url =  require('url');

var requestUrl = 'https://rz.weijing.gov.cn:8500/getaccesstoken?client_id=c1ebe466-1cdc-4bd3-ab69-77c3561b9dee&client_secret=d8346ea2-6017-43ed-ad68-19c0f971738b';

var get_option = url.parse(requestUrl);

get_option.method = 'GET';
get_option.port = 8500;
var req = https.request(get_option, function (res) {

    res.on('data', function (buffer) {
        console.log(buffer.toString());
        response = JSON.parse(buffer.toString());
        console.log(response["access_token"]);
    });
});
req.end();
