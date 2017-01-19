/**
 * Created by 80374361 on 2017/1/19.
 */
var fork = require('child_process').fork;
var cpus = require('os').cpus();

var server = require('net').createServer();
server.listen(8899);
var workers = {};
var creaetWorker = function () {
    var worker = fork(__dirname + '/worker.js');
    worker.on('message', function (message) {
       if (message.act === 'suicide') {
           creaetWorker();
       }
    });
    worker.on('exit', function () {
        console.log("Workder " + worker.pid + ' exited.');
        delete worker[worker.pid];
    });
    worker.send('server', server);
    worker[worker.pid] = worker;
    console.log('Create worker.pid:', worker.pid);
};
for (var i=0; i<cpus.length; ++i) {
    creaetWorker();
}
process.on('exit', function () {
    for (var pid in workers) {
        workers[pid].kill();
    }
})