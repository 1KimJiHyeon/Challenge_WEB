const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Board = require('../models/board');
const Post = require('../models/post');
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
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  var post = new Post();
  post.contents = req.body.contents;
  post.author = res.locals.user.id;
  post.img = req.body.url;

  Board.findOneAndUpdate({_id : req.body.id}, { $push: { posts : post}}, function (err, board) {
    if(err){
        console.log(err);
        res.redirect('/');
    }
    post.save(function (err) {
      if (err) {
        console.log(err);
        res.redirect(`/challengeBoard/${board.id}`);
      }
      res.redirect(`/challengeBoard/${board.id}`);
    });
  });
    // res.redirect(`/challengeBoard/${board.id}`);
// });
});

module.exports = router;