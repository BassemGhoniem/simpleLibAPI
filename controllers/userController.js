/**
 * Created by bassem on 10/21/16.
 */

const passport = require('passport');
const Verify = require('./../verify');

const userController = function userController(User) {
  return {
    getAllUsers(req, res) {
      User.find({}, (err, users) => {
        if (err) res.status(500).json({ err });
        res.json(users);
      });
    },
    register(req, res) {
      User.register(new User({ username: req.body.username }),
        req.body.password,
        (err) => {
          if (err) {
            res.status(500).json({ err });
          } else {
            passport.authenticate('local')(req, res, (error) => {
              if (error) {
                res.status(500).json({ error });
              } else {
                res.status(200).json({ status: 'Registration Successful!' });
              }
            });
          }
        });
    },
    login(req, res, next) {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          res.status(500).json({ err });
        }
        if (!user) {
          res.status(401).json({
            err: info,
          });
        } else {
          req.logIn(user, (error) => {
            if (error) {
              res.status(500).json({
                err: 'Could not log in user',
              });
            } else {
              const token = Verify.getToken(user);
              res.status(200).json({
                token,
                status: 'Login successful!',
                success: true,
              });
            }
          });
        }
      })(req, res, next);
    },
    logout(req, res) {
      req.logout();
      res.status(200).json({
        status: 'Bye!',
      });
    },
  };
};

module.exports = userController;
