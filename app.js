var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const config = require('./config');
const auth = require("./middleware/auth");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var setupRouter = require('./routes/setup');
var studentRouter = require('./routes/student');
var financeRouter = require('./routes/finance');
var dashboardRouter = require('./routes/dashboard');
var settingsRouter = require('./routes/settings');
var examRouter = require('./routes/exam');
var teacherRouter = require('./routes/teacher');
var homeworkRouter = require('./routes/homework');
var selectRouter = require('./routes/common');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
 
var sessionStore = new MySQLStore(config.db);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
  {
    secret: config.sessionSecret,
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: 'auto',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/setup', setupRouter);
app.use('/Teachers',auth, teacherRouter);
app.use('/Exams',auth, examRouter);
app.use('/Homeworks',auth, homeworkRouter);
app.use('/Students',auth, studentRouter);
app.use('/Finances',auth, financeRouter);
app.use('/Dashboard',auth, dashboardRouter);
app.use('/Settings',auth, settingsRouter);
app.use('/Select',auth, selectRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
