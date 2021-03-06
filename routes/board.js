const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Board = require('../models/board');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

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

const upload2 = multer();
router.post('/write', isLoggedIn, upload2.none(), async (req, res, next) => {
  var board = new Board();
  board.userId = res.locals.user.id;
  board.title = req.body.title;
  board.contents = req.body.contents;
  board.author = res.locals.user.nick;
  board.img = req.body.url;

  board.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect('/challengeBoard');
    }
    res.redirect('/challengeBoard');
  });
});

router.put('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const result = await Board.update({
      _id: req.params.id,
    }, {
      title: req.body.title,
      contents: req.body.contents,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
})

router.delete('/:id', isLoggedIn, (req, res) => {
  Board.remove({ _id: req.params.id }, function (err) {
    if (err) return res.json(err);
  });
});

module.exports = router;