var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    userId: String,
    contents: String,
    img: String,
    author: String,
    authorImg: String,
    post_date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('post', postSchema);