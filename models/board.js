/**
 * Created by ss on 2017-07-11.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = new Schema({
    title: String,
    contents: String,
    author: String,
    board_date: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('board', boardSchema);