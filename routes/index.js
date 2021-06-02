var express = require('express');
var router = express.Router();

var Board = require('../models/board');

/* GET home page. */
router.get('/', function(req, res, next) {
  Board.find({}, function (err, board) {
      res.render('index', { title: 'Express', board: board });
  });
});

/* Write board page */
router.get('/write', function(req, res, next) {
    res.render('write', { title: '글쓰기' });
});

/* board insert mongo */
router.post('/board/write', function (req, res) {
  var board = new Board();
  board.title = req.body.title;
  board.contents = req.body.contents;
  board.author = req.body.author;

  board.save(function (err) {
    if(err){
      console.log(err);
      res.redirect('/');
    }
    res.redirect('/');
  });
});

/* board find by id */
router.get('/board/:id', function (req, res) {
    Board.findOne({_id: req.params.id}, function (err, board) {
        res.render('board', { title: 'Board', board: board });
    })
});

module.exports = router;
