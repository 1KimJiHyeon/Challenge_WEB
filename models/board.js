// board와 관련된 스키마 정의 (board와 post 관계 설정)
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    userId: String,
    contents: String,
    img:String,
    author: String,
    authorImg: String,
    post_date: {type: Date, default: Date.now()}
});

var boardSchema = new Schema({
    userId: String,
    title: String,
    contents: String,
    author: String,
    img:String,
    board_date: {type: Date, default: Date.now()},
    posts: [postSchema]
});

module.exports = mongoose.model('board', boardSchema);