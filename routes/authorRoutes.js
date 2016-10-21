/**
 * Created by bassem on 10/21/16.
 */
'use strict';
const express = require('express');
const Verify = require('./../verify');

const routes = function authorRoutes(Author) {
  const authorRouter = express.Router();
  const authorController = require('../controllers/authorController')(Author);

  authorRouter.route('/')
    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, authorController.post)
    .get(Verify.verifyOrdinaryUser, authorController.getAll)
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, authorController.deleteAll);

  /**
   * the following middleware is used to find the author with the passed ID and attach it
   * to the request to be used with the following routes
   */

  authorRouter.use('/:authorId', (req, res, next) => {
    Author.findById(req.params.authorId, (err, author) => {
      if (err) {
        res.status(500).send(err);
      } else if (!author) {
        res.status(404).send('no author found');
      } else {
        req.author = author;
        next();
      }
    });
  });
  authorRouter.route('/:authorId')
    .get(Verify.verifyOrdinaryUser, authorController.getOne)
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, authorController.put)
    .patch(Verify.verifyOrdinaryUser, Verify.verifyAdmin, authorController.patch)
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, authorController.deleteOne);
  return authorRouter;
};

module.exports = routes;
