/**
 * Created by Bestray3 on 2/25/17.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  createUser:String,
  firstname:String,
  middlename:String,
  lastname:String,
  email:String,
  password:String,
  Role:String,
  contact:String


});

var Model = mongoose.model('createUser', UserSchema, 'createUser');

module.exports = Model;

