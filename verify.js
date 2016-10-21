/**
 * Created by bassem on 10/21/16.
 */
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config.js');
const User = require('./models/userModel');


module.exports = {
  getToken(user) {
    return jwt.sign(user, config.secretKey, {
      expiresIn: 3600,
    });
  },
  verifyOrdinaryUser(req, res, next) {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
          res.status(401).json({
            err: 'You are not authenticated!',
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).json({
        err: 'No token provided!',
      });
    }
  },
  verifyAdmin(req, res, next) {
    if (req.decoded._doc.admin) {
      next();
    } else {
      res.status(403).json({
        err: 'You are not authorized to perform this operation!',
      });
    }
  },
};
