/**
 * Created by bassem on 10/20/16.
 */
'use strict';
const express = require('express');

const routes = function bookRoutes(Book) {
  const bookRouter = express.Router();
  const bookController = require('../controllers/bookController')(Book);

  bookRouter.route('/')
    .post(bookController.post)
    .get(bookController.getAll)
    .delete(bookController.deleteAll);

  /**
   * the following middleware is used to find the book with the passed ID and attach it
   * to the request to be used with the following routes
   */
  bookRouter.use('/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        res.status(500).send(err);
      } else if (!book) {
        res.status(404).send('no book found');
      } else {
        req.book = book;
        next();
      }
    });
  });
  bookRouter.route('/:bookId')
    .get(bookController.getOne)
    .put(bookController.put)
    .patch(bookController.patch)
    .delete(bookController.deleteOne);
  return bookRouter;
};

module.exports = routes;
