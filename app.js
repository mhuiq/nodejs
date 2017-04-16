var express = require('express');
//var cors =  require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var UUID = require('node-uuid');

var index = require('./routes/index');
var users = require('./routes/users');
var house = require('./routes/house');
var device = require('./routes/device');
var authInfo = require('./routes/auth');
var visitors = require('./routes/visitors');
var auth_result = require('./routes/auth_result');
var login = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cors());

app.use(function (req, res, next) {
  // TODO 记录访问日志
  // console.log();
  console.log(req.originalUrl + ' : ' + JSON.stringify(req.cookies));
  var sid = req.cookies['sid'];
  if (sid === undefined || sid === '') {
    sid = UUID.v1();
    res.setHeader("Set-Cookie", ['sid=' + sid, 'path=/']);
    req.cookies['sid'] = sid;
  }
  next();
});
app.use('/', index);
app.use('/userInfo', users);
app.use('/houseInfo', house);
app.use('/devInfo', device);
app.use('/authInfo', authInfo);
app.use('/visitorsInfo', visitors);
app.use('/cert_result', auth_result);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('错误为：', err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
