/**
 * Created by bassem on 10/20/16.
 */

'use strict';

/**
 * @function addLinks attach api navigation links for to each book.
 * @param req
 * @param books
 * @returns {Array}
 */
const addHyperMediaLinks = function addLinks(req, books) {
  const returnBooks = [];
  books.forEach((element) => {
    const newBook = element.toJSON();
    newBook.links = {};
    newBook.links.self = `http://'${req.headers.host}/books/${newBook._id}`;
    const genreLink = `http://${req.headers.host}/books/?genre=${newBook.genre}`;
    const titleLink = `http://${req.headers.host}/books/?title=${newBook.title}`;
    const authorLink = `http://${req.headers.host}/books/?author=${newBook.author}`;

    newBook.links.searchByThisGenre = genreLink.replace(/\s/g, '%20');
    newBook.links.searchByName = titleLink.replace(/\s/g, '%20');
    newBook.links.searchByAuthor = authorLink.replace(/\s/g, '%20');
    returnBooks.push(newBook);
  });
  return returnBooks;
};


const bookController = function bookController(Book) {
  return {
    /**
     * @function post handle the post method result in insertion of new Book
     * @param req {object} the request which it's body is the actual object will be inserted
     * @param res {object} the response of the server to the client which is 201 if success
     * 500 otherwise.
     */
    post(req, res) {
      const book = new Book(req.body);
      book.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send(book);
        }
      });
    },

    /**
     * @function getAll returns all the available books from the database if there is not query
     *            or return the only books that match the query object.
     * @param req
     * @param res
     */
    getAll(req, res) {
      const query = {};

      if (req.query.genre) {
        query.genre = req.query.genre;
      }
      if (req.query.title) {
        query.title = req.query.title;
      }
      if (req.query.author) {
        query.author = req.query.author;
      }
      Book.find(query, (err, books) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(addHyperMediaLinks(req, books));
        }
      });
    },

    /**
     * @function deleteAll removes all the books from the books collection
     * @param req
     * @param res
     */
    deleteAll(req, res) {
      Book.remove({}, (err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(204).send('Removed All');
        }
      });
    },

    /**
     * @function getOne returns the book that it's id was passed with the request after
     *           chaining api navigation links to the returned object.
     * @param req
     * @param res
     */
    getOne(req, res) {
      const returnBook = req.book.toJSON();
      returnBook.links = {};
      const genreLink = `http://${req.headers.host}/books/?genre=${returnBook.genre}`;
      const titleLink = `http://${req.headers.host}/books/?title=${returnBook.title}`;
      const authorLink = `http://${req.headers.host}/books/?author=${returnBook.author}`;

      returnBook.links.searchByThisGenre = genreLink.replace(' ', '%20');
      returnBook.links.searchByName = titleLink.replace(' ', '%20');
      returnBook.links.searchByAuthor = authorLink.replace(' ', '%20');
      res.json(returnBook);
    },

    /**
     * @function put handles the put method which updates the whole object with the new object
     *           received from the request.
     * @param req
     * @param res
     */
    put(req, res){
      for (let p in req.body) {
        req.book[p] = req.body[p];
      }
      req.book.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(req.book);
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
        req.book[p] = req.body[p];
      }

      req.book.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(req.book);
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
      req.book.remove((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(204).send('Removed');
        }
      });
    },

    /**
     * @function getRecent finds the recent five books by sorting the books by creation date.
     * @param req
     * @param res
     */
    getRecent(req, res) {
      Book.find({}).sort({ createdAt: -1 }).limit(5).exec((err, books) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(addHyperMediaLinks(req, books));
        }
      });
    },
  };
};


module.exports = bookController;
