var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    contents: String,
    img: String,
    author: String,
    post_date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('post', postSchema);