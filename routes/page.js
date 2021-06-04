const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');
const Board = require('../models/board');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join');
});

router.get('/challengeBoard', function (req, res, next) {
  Board.find({}, function (err, boards) {
    res.render('challengeBoard', { boards: boards });
  });
});

router.get('/challengeForm', (req, res) => {
  res.render('challengeForm');
});

router.get('/challengeBoard/:id', function (req, res) {
  Board.findOne({_id: req.params.id}, function (err, board) {
      res.render('challengePost', { board: board });
  })
});

router.get('/', async (req, res, next) => {
  res.render('main');
});

module.exports = router;