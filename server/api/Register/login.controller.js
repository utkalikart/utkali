/**
 * Created by Bestray3 on 11/2/2016.
 */
'use strict';
var User = require('./users.model');
var mongodb = require('../../models/mongodbConnection.js');
var LoginHistory = require('./loginhistory.model');
var EmailServices = require('./EmailService');
var bcrypt=require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);

exports.loginProcess = function(req, res) {
  var email       = req.body.email;
  var password    = req.body.password;
  var isValidUser = false;
  var status      = false;
  var lastLoginInfo    = {};
  if(Object.keys(req.body).length <= 0) {
    status = false;
    res.json({save:status});
  } else if(email==undefined || email==null || email=='') {
    status = false;
    res.json({save:status});
  } else if(password==undefined || password==null || password=='') {
    status = false;
    res.json({save:status});
  } else {
    User.findOne({$and:[{email:req.body.email},{isActive:true}]}, {}, { sort: { 'created_at' : -1 } }, function(err, user) {
      if(err) {
        return handleError(res, err);
      } else {
        
        if(user == null) {
          isValidUser = false;
          res.json({save:false,msz:'You have not activated the email verification process.please do verify the email'});
        } else {
          user = user.toObject();

          var user_session = {
              firstname   : user.firstname,
              lastname    : user.lastname,
              username    : user.username,
              role        : user.role,
              profilePicture : user.pp,
              _id    :   user._id.toString()
          };
        
          req.session.user = user_session;
          var sess         = req.session.user.firstname;
       
          var pass_comp    = bcrypt.compare(password, user.password, function(err, isPasswordMatch) {
         
            if(isPasswordMatch) {
              var inserted_data = {
                userId    :   user._id.toString(),
                firstname :   user.firstname,
                lastname  :   user.lastname,
                LoginDate :   Date(),
                status    :   isPasswordMatch,
                cd        :   new Date()
              }

              db.collection('LoginHistory').insert([inserted_data],function(error,result) {
                  if(error) {
                    return handleError(res, err);
                  } else {
                    LoginHistory.find({userId:user._id.toString()}, {}, { sort: { 'cd' : -1 }}, function(err, loginResult) {
                      if(err) {
                        return handleError(res, err);
                      } else {                      
                        if(loginResult.length == 0) {
                          lastLoginInfo = {};
                        } else {
                          lastLoginInfo = loginResult[0];
                        }
                        
                        user._id   = user._id.toString()
                        var jwt    = require('jsonwebtoken');
                        
                        var token  = jwt.sign(user_session, 'fhir430', {
                          expiresIn: 60*60*24 // expires in 24 hours
                        });
                        
                        var loginResponse = {
                            save         :   isPasswordMatch,
                            msg          :   '',
                            msz          :   '',
                            token        :   token,
                            sessionUser  :   req.session.user.firstname,
                            lastLogin    :   lastLoginInfo, 
                            userinfo     :   req.session.user                            
                        };          
                        res.json(loginResponse);
                      }
                    }).limit(2);
                  }
              });
            } else {
              res.json({save:isPasswordMatch,msg:'Wrong password',msz:'',sessionUser:'',lastLogin:''});
            }
          });
        }
      }
    });
  }
};

exports.forgotPasswordProcess=function(req,res){
  var status=true;
  var email=req.body.email;
  email = email.toLowerCase();
  
  User.findOne({email:req.body.email}, {}, { sort: { 'created_at' : -1 } }, function(err, result) {
    if(err) {
      return handleError(res, err);
    }else{
      if(result==undefined || result==null){
        //result={};
        res.json({save:false,msg:'This emailid is not yet registered'});
      }else{
        EmailServices.forgotPasswordMail(req,res,function(err, mailStatus){

        });
        res.json({save:status,msg:''});
      }

    }
  });

};

exports.confirmPasswordProcess = function(req,res) {
  var status=true;
  var email = req.body.email;
  email = email.toLowerCase();

  var newPassword = req.body.newPassword;
  var confirmPassword = req.body.confirmPassword;
  console.log("newPassword"+newPassword)
  console.log("confirmPassword"+confirmPassword)

  User.findOne({email: req.body.email}, {}, {sort: {'created_at': -1}}, function (err, user) {
    if (err) {
      return handleError(res, err);
    }else {
      var newhash;
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newPassword, salt, function(err, hash) {
          user.password = hash;
          user.save(function(error,result){
            if(error){
              console.log("error"+error);
              return handleError(res, err);
            }else{
              EmailServices.passwordResetDetailsMailToUser(req,res,function(err, mailStatus){
              });
              res.json({save:status,msg:''});
            }

          });
        });
      });



    }

    // });
  });
};

exports.logOutProcess=function(req,res){
  var status=true;
  req.session.user = null;
  res.json({save:status});
};

function handleError(res, err) {
  return res.status(500).send(err);
}
