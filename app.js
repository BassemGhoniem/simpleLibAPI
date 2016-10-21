/**
 * Created by bassem on 10/20/16.
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Book = require('./models/bookModel');
const Author = require('./models/authorModel');
const User = require('./models/userModel');

const userRouter = require('./routes/userRoutes')(User);
const bookRouter = require('./routes/bookRoutes')(Book);
const authorRouter = require('./routes/authorRoutes')(Author);
const config = require('./config');

const app = express();
const port = process.env.PORT || 3000;
mongoose.connect(config.mongodbUrl);

// passport config
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('welcome to my API!');
});

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/authors', authorRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
  });
});


app.listen(port, () => {
  console.log(`Gulp is running my app on  PORT: ${port}`);
});

module.exports = app;
