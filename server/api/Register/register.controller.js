
'use strict';
var User = require('./users.model');
var mongodb = require('../../models/mongodbConnection.js');
var EmailServices = require('./EmailService');
var bcrypt=require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);

exports.registerProcess = function(req, res) {
  var firstname   = req.body.firstName;
  var lastname    = req.body.lastName;
  var phone       = req.body.phone;
  var company     = req.body.company;
  var email       = req.body.email;
  var password    = req.body.password;
  var user_name    = req.body.user_name;
  var year        = req.body.year;
  var department      = req.body.department;
  var tenthMark    = req.body.tenthMark;
  var twelvethMark    = req.body.twelvethMark;
  var status      = false;
  var isActive    = false;
console.log(year+department+tenthMark+twelvethMark+user_name)
  //-------------------------------------
  // add mail authntication paramiters to url
  var length=64;
  var chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var mail_param = '';
  for (var i = length; i > 0; --i) mail_param += chars[Math.round(Math.random() * (chars.length - 1))];

  // add status to mail param
  var mail_param_isActive='Yes';
  req.body["mail_param"]=mail_param;
  req.body["mail_param_isActive"]=mail_param_isActive;
  req.body["isActive"]=isActive;
  //-------------------------------------

  if(Object.keys(req.body).length <=0){
    status=false;
    res.json({save:status});
  }else if(firstname==undefined || firstname==null || firstname==''){
    status=false;
    res.json({save:status});
  }else if(lastname==undefined || lastname==null || lastname==''){
    status=false;
    res.json({save:status});
  }else if(phone==undefined || phone==null || phone==''){
    status=false;
    res.json({save:status});
  }else if(email==undefined || email==null || email==''){
    status=false;
    res.json({save:status});
  }else if(password==undefined || password==null || password==''){
    status=false;
    res.json({save:status});
  }else{
    console.log('1')
    email = email.toLowerCase();
    var newhash;
    bcrypt.genSalt(10, function(err, salt) {
      if(err) {
        console.log(err);
      } else {
        bcrypt.hash(password, salt, function(err, hash) {
          if(err) {
            console.log(err);
          } else {
            console.log('2')
            newhash   = hash;
            status    = true;
            var param = {
              created_at            :   new Date(),
              firstname             :   firstname,
              lastname              :   lastname,
              phone                 :   phone,
              company               :   company,
              email                 :   email,
              year                  :   year,
              department                :   department,
              tenthMark             :   tenthMark+'%',
              twelvethMark          :   twelvethMark+'%',
              user_name             :   user_name,
              password              :   newhash,
              "mail_param"          :   req.body.mail_param,
              "mail_param_isActive" :   req.body.mail_param_isActive,
              "isActive"            :   req.body.isActive,
              "pp"                  :   "/assets/images/fhir.png"
            }
            db.collection('User').findOne({email:req.body.email}, {}, { sort: { 'created_at' : -1 } }, function(err, usr) {
              if(usr == undefined || usr == null) {
                usr={};
              }
              if(err) {
                return handleError(res, err);
              } else if(Object.keys(usr).length > 0) {
                res.json({save:false,msg:'This emailId is already registered'});
              } else {
                db.collection("role").find({name:"NewUser"}).limit(1).toArray(function(err,roleData){
                  if(!err && roleData.length>0) {
                    param["role"] = roleData
                  } else {
                    param["role"] = [];
                  }
                  db.collection('User').insert([param],function(error,result) {
                    if(error) {
                    } else {
                      console.log('3')
                      EmailServices.registerOnSuccessMail(req,res,function(err, mailStatus){});
                      res.json({save:status,msg:''});
                    }
                  });
                })
              }
            });
          }
        });
      }
    });
  }
};

function handleError(res, err) {
  return res.status(500).send(err);
}
