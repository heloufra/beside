const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');
const auth = require("./middleware/auth");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const setupRouter = require('./routes/setup');
const studentsRouter = require('./routes/students');
const parentsRouter = require('./routes/parent');
const financeRouter = require('./routes/finance');
const dashboardRouter = require('./routes/dashboard');
const settingsRouter = require('./routes/settings');
const examRouter = require('./routes/exam');
const teacherRouter = require('./routes/teacher');
const homeworkRouter = require('./routes/homework');
const selectRouter = require('./routes/common');
const currentStudentRouter = require('./routes/currentStudent');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
 
const sessionStore = new MySQLStore(config.db);

const app = express();

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
app.use('/Students',auth, studentsRouter);
app.use('/Parents',auth, parentsRouter);
app.use('/Finances',auth, financeRouter);
app.use('/Dashboard',auth, dashboardRouter);
app.use('/Settings',auth, settingsRouter);
app.use('/Select',auth, selectRouter);
app.use('/',auth, currentStudentRouter);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('error', {title: '404'});
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
