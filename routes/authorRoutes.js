/**
 * Created by bassem on 10/21/16.
 */
'use strict';
const express = require('express');

const routes = function authorRoutes(Author) {
  const authorRouter = express.Router();
  const authorController = require('../controllers/authorController')(Author);

  authorRouter.route('/')
    .post(authorController.post)
    .get(authorController.getAll)
    .delete(authorController.deleteAll);

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
    .get(authorController.getOne)
    .put(authorController.put)
    .patch(authorController.patch)
    .delete(authorController.deleteOne);
  return authorRouter;
};

module.exports = routes;
