/**
 * Created by Bestray3 on 11/9/2016.
 */
'use strict';
var User = require('./users.model');
var EmailServices = require('./EmailService');
var mongodb = require('../../models/mongodbConnection.js');

exports.validateMailParam = function(req, rs) {
  var validated;
  var msg='';
  var isActive=true;
  var status=true;
  var email = req.body.emailid;
  db.collection('User', function(err, collection) {
    email = email.toLowerCase();
    collection.findOne({"email":email},function(err,res){
      if(err){console.log('-->2Err: '+err);}
      if(res.mail_param_isActive=='Yes'){
        //if(res.mail_param==req.body.mail_param){
          validated=true;
          msg='Successfully validated';
          collection.update({"email":email}, {$set:{"mail_param_isActive":'No',"isActive":isActive}}, {multi:false}, function(err, result) {
            if(err){console.log('-->3Err: '+err)}
            rs.json({validated:validated});
          });
        /*}else{
          validated=false;
          msg='Mail param not matching';
          console.log('-->Status: '+msg)
        }*/
      }else{
        validated=false;
        msg='Already Validated';
        rs.json({validated:validated});
      }
    });
  });
};
function handleError(res, err) {
  return res.status(500).send(err);
}
