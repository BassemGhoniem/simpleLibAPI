/**
 * Created by bassem on 10/21/16.
 */

'use strict';
const authorController = function authorController(Author) {
  return {
    /**
     * @function post handle the post method result in insertion of new Author
     * @param req {object} the request which it's body is the actual object will be inserted
     * @param res {object} the response of the server to the client which is 201 if success
     * 500 otherwise.
     */
    post(req, res) {
      const author = new Author(req.body);
      author.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201);
          res.send(author);
        }
      });
    },

    /**
     * @function getAll returns all the available authors from the database if there is not query
     *            or return the only authors that match the query object.
     * @param req
     * @param res
     */
    getAll(req, res) {
      const query = {};
      if (req.query.name) {
        query.name = req.query.name;
      }
      Author.find(query, (err, authors) => {
        if (err) {
          res.status(500).send(err);
        } else {
          const returnAuthors = [];
          authors.forEach((element) => {
            const newAuthor = element.toJSON();
            newAuthor.links = {};
            newAuthor.links.self = `http://'${req.headers.host}/authors/${newAuthor._id}`;
            returnAuthors.push(newAuthor);
          });
          res.json(returnAuthors);
        }
      });
    },

    /**
     * @function deleteAll removes all the authors from the authors collection
     * @param req
     * @param res
     */
    deleteAll(req, res) {
      Author.remove({}, (err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(204).send('Removed All');
        }
      });
    },

    /**
     * @function getOne returns the author that it's id was passed with the request after
     *           chaining api navigation links to the returned object.
     * @param req
     * @param res
     */
    getOne(req, res) {
      res.json(req.author);
    },

    /**
     * @function put handles the put method which updates the whole object with the new object
     *           received from the request.
     * @param req
     * @param res
     */
    put(req, res){
      for (let p in req.body) {
        req.author[p] = req.body[p];
      }
      req.author.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(req.author);
        }
      });
    },

    /**
     * @function patch handles http request with patch method, used when we need to update
     *           single field in the object we don't need to pass the whole object with
     *           the request, only the field needs to be updated.
     *           Perfect for updating single field such as the rate without sending
     *           the whole object
     * @param req
     * @param res
     */
    patch(req, res) {
      if (req.body._id) {
        delete req.body._id;
      }
      for (let p in req.body) {
        req.author[p] = req.body[p];
      }

      req.author.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(req.author);
        }
      });
    },

    /**
     * @function deleteOne handles the http delete method and delete the object which it's id
     * sent with the request
     * @param req
     * @param res
     */
    deleteOne(req, res) {
      req.author.remove((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(204).send('Removed');
        }
      });
    },
  };
};

module.exports = authorController;
