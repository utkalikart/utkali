/**
 * Created by Bestray3 on 11/1/2016.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  created_at: Date,
  username:String,
  firstname:String,
  lastname:String,
  phone:Number,
  company:String,
  email:String,
  password:String,
  department:String,
  year:String,
  tenthMark:String,
  twelvethMark:String,
  user_name:String,
  mail_param:String,
  mail_param_isActive:String,
  isActive:Boolean,
  Role:String,
  imagePath:String

});

var Model = mongoose.model('User', UserSchema, 'User');

module.exports = Model;
