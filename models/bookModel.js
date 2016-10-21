/**
 * Created by bassem on 10/20/16.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const book = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  author: {
    type: String,
  },
  genre: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Book', book);
