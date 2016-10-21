/**
 * Created by bassem on 10/20/16.
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');

const Book = require('./models/bookModel');
const Author = require('./models/authorModel');
const bookRouter = require('./routes/bookRoutes')(Book);
const authorRouter = require('./routes/authorRoutes')(Author);

const app = express();
const port = process.env.PORT || 3000;

if (process.env.ENV === 'Test') {
  mongoose.connect('mongodb://localhost/simpleLibAPI_test');
} else {
  mongoose.connect('mongodb://localhost/simpleLibAPI');
}

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('welcome to my API!');
});
app.use('/books', bookRouter);
app.use('/authors', authorRouter);

app.listen(port, () => {
  console.log(`Gulp is running my app on  PORT: ${port}`);
});

module.exports = app;
