/**
 * Created by sparshithp on 10/17/16.
 */
var mongoose = require('mongoose');

var contextSchema = new mongoose.Schema({
    userId: String,
    intent: String
});

module.exports = mongoose.model('Context', contextSchema);