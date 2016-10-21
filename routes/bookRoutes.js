/**
 * Created by bassem on 10/20/16.
 */
'use strict';
const express = require('express');
const Verify = require('./../verify');

const routes = function bookRoutes(Book) {
  const bookRouter = express.Router();
  const bookController = require('../controllers/bookController')(Book);

  bookRouter.route('/')
    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, bookController.post)
    .get(Verify.verifyOrdinaryUser, bookController.getAll)
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, bookController.deleteAll);

  bookRouter.route('/recent')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, bookController.getRecent);

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
    .get(Verify.verifyOrdinaryUser, bookController.getOne)
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, bookController.put)
    .patch(Verify.verifyOrdinaryUser, Verify.verifyAdmin, bookController.patch)
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, bookController.deleteOne);
  return bookRouter;
};

module.exports = routes;
