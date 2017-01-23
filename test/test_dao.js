/**
 * Created by 80374361 on 2017/1/23.
 */

var devInfoDao = require('../lib/dao/dev_info_dao');
var db = require('../lib/db_connection_factory');

(function () {
    var appId = '23980BD8-1F92-4B73-929D-7CD5E24415AE';
    devInfoDao.queryByAppId(appId, function (result) {
        console.log(result);
    });
    db.close();
})();