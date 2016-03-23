var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('connect-flash');
var request = require('request');

var routes = require('./routes/index');
var users = require('./routes/users');
var details = require('./routes/details');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎
app.set('view engine', 'html');
//设置一下对于html格式的文件，渲染的时候委托ejs的渲染方面来进行渲染
app.engine('html', require('ejs').renderFile);
var mongoose = require('mongoose');
connection = mongoose.createConnection('mongodb://123.57.143.189:27017/yuanblog');

app.use(session({
  secret: 'dataEye',
  resave: false,
  saveUninitialized: true,
  //指定保存的位置
  store: new MongoStore({mongooseConnection:connection})
}));



// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/details', details);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
