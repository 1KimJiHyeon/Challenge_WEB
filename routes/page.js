const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');
const Board = require('../models/board');
const Comment = require('../models/comment');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

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

const upload2 = multer();
router.post('/challengeForm/write', upload2.none(), async (req, res, next) => {
  var board = new Board();
  board.title = req.body.title;
  board.contents = req.body.contents;
  board.author = req.body.author;
  board.img = req.body.url;

  board.save(function (err) {
    if(err){
      console.log(err);
      res.redirect('/challenge');
    }
    res.redirect('/challenge');
  });
});

/* board find by id */
router.get('/challenge/:id', async function (req, res) {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    Board.findOne({_id: req.params.id}, function (err, board) {
      res.render('challengePost', { board: board, twits: posts });
  })
  } catch (err) {
    console.error(err);
    next(err);
  }


});

/* comment insert mongo*/
router.post('/comment/write', function (req, res){
  var comment = new Comment();
  comment.contents = req.body.contents;
  comment.author = req.body.author;

  Board.findOneAndUpdate({_id : req.body.id}, { $push: { comments : comment}}, function (err, board) {
      if(err){
          console.log(err);
          res.redirect('/');
      }
      res.redirect('/challenge/'+req.body.id);
  });
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