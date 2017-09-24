var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name:String,
  roleId:Number,
  permissionList:JSON
});

var Model = mongoose.model('role', UserSchema, 'role');

module.exports = Model;

