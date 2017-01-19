/**
 * Created by 80374361 on 2017/1/19.
 */
process.on('message', function (m) {
   console.log('Child got message:', m);
});
process.send({foo:'bar'});