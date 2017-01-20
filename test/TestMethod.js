/**
 * Created by 80374361 on 2017/1/20.
 */

(function () {
    var jsonStr = '{"cert_token": "abcedefefe", "full_name": "hello", "id_num": "339002383002"}';
    var jsonSubject = JSON.parse(jsonStr);
    console.log(jsonSubject.cert_token);
    console.log(jsonSubject['full_name']);
})();