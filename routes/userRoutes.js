/**
 * Created by bassem on 10/21/16.
 */
const express = require('express');

const Verify = require('./../verify');

const routes = function userRoutes(User) {
  const router = express.Router();
  const userController = require('../controllers/userController')(User);
  router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, userController.getAllUsers)
    .post('/register', userController.register)
    .post('/login', userController.login)
    .get('/logout', userController.logout);
  return router;
};

module.exports = routes;
