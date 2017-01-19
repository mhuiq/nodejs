/**
 * Created by 80374361 on 2017/1/19.
 */

var cluster = require('cluster');
cluster.setupMaster({
    exec:'worker.js'
});
var cpus = require('os').cpus();
for (var i=0; i<cpus.length; ++i) {
    cluster.fork();
}

