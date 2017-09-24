var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChartSchema = new Schema({
  cd: Date,
  depth: Number,
  parentIdPath: String,
  nodeName: String,
  parent: String,
  parentId: String
});

var Model = mongoose.model('User', ChartSchema, 'User');

module.exports = Model;

