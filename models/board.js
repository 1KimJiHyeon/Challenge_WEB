/**
 * Created by ss on 2017-07-11.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    contents: String,
    img:String,
    author: String,
    comment_date: {type: Date, default: Date.now()}
});

var boardSchema = new Schema({
    title: String,
    contents: String,
    author: String,
    img:String,
    board_date: {type: Date, default: Date.now()},
    comments: [commentSchema]
});

module.exports = mongoose.model('board', boardSchema);