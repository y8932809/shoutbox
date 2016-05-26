//set EDBUG=shoutbox & npm start 启动命令
//redis-server.exe  redis.conf 启动数据库

//测试 node --debug bin\www
//新开一个 node-inspector &
//228页
//少了post方法和api验证身份
var express = require('express');
var path = require('path');
var message=require('./lib/messages');
var favicon = require('serve-favicon');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var user=require('./lib/middleware/user');
var login=require("./routes/login");
var entries=require('./routes/entries');
var api=require('./routes/api');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
        secret: '12345',
         name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
         cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
         resave: false,
         saveUninitialized: true,
}));
app.use(user);
app.use(message);
app.use('/', routes);
app.use('/api',api);
app.use('/users', users);
app.use('/login',login);
app.use('/entries',entries);
app.use('/api',api);
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
