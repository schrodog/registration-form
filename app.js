const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require("http");
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

const app = express();
const adminApp = express();

const PORT = 3000;
const ADMIN_PORT = 3001;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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


const server = http.createServer(app)
server.listen(PORT, () => console.log("listening on port 3000"))

// ============== Admin App =====================
adminApp.use('/', adminRouter);
adminApp.set('views', path.join(__dirname, 'views'));
adminApp.set('view engine', 'ejs');

adminApp.use(logger('dev'));
adminApp.use(express.json());
adminApp.use(express.urlencoded({ extended: false }));
adminApp.use(cookieParser());
adminApp.use(express.static(path.join(__dirname, 'public')));


const adminServer = http.createServer(adminApp)
adminServer.listen(ADMIN_PORT, () => console.log('listening on port 3001'))


module.exports = app;
