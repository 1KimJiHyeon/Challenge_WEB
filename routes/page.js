const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');
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

router.get('/challenge', function(req, res, next) {
  Board.find({}, function (err, boards) {
      res.render('challenge', { boards: boards });
  });
});

router.get('/challengeForm', (req, res) => {
  res.render('challengeForm');
});

router.post('/challengeForm/write', function (req, res) {
  var board = new Board();
  board.title = req.body.title;
  board.contents = req.body.contents;
  board.author = req.body.author;

  board.save(function (err) {
    if(err){
      console.log(err);
      res.redirect('/challenge');
    }
    res.redirect('/challenge');
  });
});

/* board find by id */
router.get('/challenge/:id', function (req, res) {
  Board.findOne({_id: req.params.id}, function (err, board) {
      res.render('challengePost', { board: board });
  })
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;