var userDao = require('../lib/dao/user_info_dao');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getAll', function(req, res, next) {
    userDao.
    console.log(req);
    res.send('respond with users');
    res.end();
});

module.exports = router;
