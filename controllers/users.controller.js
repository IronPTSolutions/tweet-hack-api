const User = require('../models/user.model');
const passport = require('passport')
const createError = require('http-errors');

module.exports.create = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar: req.file ? req.file.url : undefined,
    bootcamp: req.body.bootcamp
  })

  user.save()
    .then((user) => res.status(201).json(user))
    .catch(next)
}

module.exports.profile = (req, res, next) => {
  User.findById(req.currentUser.id)
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        throw createError(404, 'user not found');
      }
    })
    .catch(next)
}

module.exports.doSocialLogin = (req, res, next) => {
  const passportController = passport.authenticate("slack", (error, user) => {
    if (error) {
      next(error);
    } else {
      req.session.user = user;
      res.redirect(`${process.env.WEB_URL}/social-auth/cb`);
    }
  })
  
  passportController(req, res, next);
}

module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw createError(400, 'missing credentials');
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        throw createError(404, 'user not found');
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (!match) {
              throw createError(400, 'invalid password');
            } else {
              req.session.user = user;
              //res.cookie('foo', 'bar')
              res.json(user)
            }
          })
      }
    })
    .catch(next);
}

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.status(204).json();
}
