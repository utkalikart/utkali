var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name:String,
  displayName:String,
  displayName2:String,
  permissionUrl:String
});

var Model = mongoose.model('permissions', UserSchema, 'permissions');

module.exports = Model;

