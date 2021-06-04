const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post } = require('../models');
const Board = require('../models/board');
const Comment = require('../models/comment');
const { isLoggedIn } = require('./middlewares');

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

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  var comment = new Comment();
  comment.contents = req.body.contents;
  comment.author = req.body.author;
  comment.img = req.body.url;

  Board.findOneAndUpdate({_id : req.body.id}, { $push: { comments : comment}}, function (err, board) {
    if(err){
        console.log(err);
        res.redirect('/');
    }
    res.redirect(`/challengeBoard/${board.id}`);
});
});

module.exports = router;