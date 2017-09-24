/**
 * Created by Bestray3 on 11/23/2016.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  userId:String,
  firstname:String,
  lastname:String,
  LoginDate:String,
  status:String
});

var Model = mongoose.model('LoginHistory', UserSchema, 'LoginHistory');

module.exports = Model;

