
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  created_at: Date,
  firstName:String,
  lastName:String,
  phone:Number,
  company:String,
  email:String,
  password:String,
  /*securityQuestion:String,
   securityAnswer:String,*/
  mail_param:String,
  mail_param_isActive:String,
  isActive:String,
  role:Array,
  imagePath:String

});

var Model = mongoose.model('User', UserSchema, 'User');

module.exports = Model;
