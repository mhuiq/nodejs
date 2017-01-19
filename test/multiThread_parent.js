/**
 * Created by 80374361 on 2017/1/19.
 */
var cp = require('child_process');
var n = cp.fork(__dirname + "/multiThread_child");

n.on('message', function (m) {
   console.log('Parent got message:', m);
});
n.send({hello: 'world'});