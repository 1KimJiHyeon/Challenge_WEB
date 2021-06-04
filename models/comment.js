/**
 * Created by ss on 2017-07-11.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    contents: String,
    img: String,
    author: String,
    comment_date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('comment', commentSchema);