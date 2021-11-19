require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo');


var commentRouter = require('./routes/comment')
var postRouter = require('./routes/post');
var userRouter = require('./routes/user/user')
var signinRouter = require('./routes/user/signin');
var registerRouter = require('./routes/user/register');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(expressSession( {
  secret: 'secret',
  // store: MongoStore.create({mongoUrl: 'mongodb://localhost/meowsocial'})
}))

// const port = process.env.PORT || 3000;

app.use('/post/comment', commentRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/signin', signinRouter);
app.use('/register', registerRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

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
