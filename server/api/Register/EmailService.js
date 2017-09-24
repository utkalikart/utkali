/*
 * @Author :: Rakesh
 * @description :: Email Service handles all the email sending functionality in the iFHIR application
 *
 * */

var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var baseUrlForRegister=config.BaseUrl+"/#/post-validate-register";
var baseUrlForForgotPassword=config.BaseUrl+"/#/confirm-password";
var baseUrlForPasswordReset=config.BaseUrl+"/#/confirm-password-mail-sent";
/*var supportMail= process.env.SUPPORT_MAIL;
 var supportPass= process.env.SUPPORT_PASS;*/
var supportMail="fhir360@gmail.com";
var supportPass="Bestray11#";

var EmailService = {

  registerOnSuccessMail: function(req, res, callback) {
    var email = req.body.email;
    var password = req.body.password;
    var mail_param=req.body.mail_param;
    var mail_param_isActive=req.body.mail_param_isActive;

    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      auth: {
        user: supportMail,
        pass: supportPass
      }
    }));
    var mailOptions = {
      from: supportMail, // sender address
      to: email, // list of receivers
      subject: 'Welcome to iFHIR', // Subject line
      //text: 'Hello world' // plaintext body
      html: 'Welcome to iFHIR. See below for your username and password. Please note that passwords are case sensitive.<br/><br/>' +
      'Username: '+email+'<br/>'+
      'Password: '+password+'<br/><br/>'+
      'Simply visit: '+
      '<i>'+baseUrlForRegister+'?mail_param='+mail_param+'&emailid='+email+'</i>'+'  to login using the information above.<br/><br/>'+
      'Thanks,<br/>'+
      'Adminstrator<br/>'+
      'rakfhir@gmail.com'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      }else{

      }
    });

  },

  forgotPasswordMail:function(req, res, callback){
    var email = req.body.email;
    var password = req.body.password;
    var mail_param=req.body.mail_param;
    var mail_param_isActive=req.body.mail_param_isActive;

    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      auth: {
        user: supportMail,
        pass: supportPass
      }
    }));
    var mailOptions = {
      from: supportMail, // sender address
      to: email, // list of receivers
      subject: 'Reset Password', // Subject line
      //text: 'Hello world' // plaintext body
      html: 'Welcome to iFHIR. If you remember your password, please ignore it.<br/><br/>' +
      'Username: '+email+'<br/>'+
      'To reset your password,Simply visit: '+
      '<i>'+baseUrlForForgotPassword+'?mail_param='+mail_param+'&emailid='+email+'</i>'+'<br/><br/>'+
      'Thanks,<br/>'+
      'Adminstrator<br/>'+
      'rakfhir@gmail.com'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      }else{
      }
    });

  },

  passwordResetDetailsMailToUser:function(req,res,callback){
    var email = req.body.email;
    var password = req.body.password;
    var newPassword = req.body.newPassword;

    var mail_param=req.body.mail_param;
    var mail_param_isActive=req.body.mail_param_isActive;

    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      auth: {
        user: supportMail,
        pass: supportPass
      }
    }));
    var mailOptions = {
      from: supportMail, // sender address
      to: email, // list of receivers
      subject: 'Reset Password', // Subject line
      //text: 'Hello world' // plaintext body
      html: 'Your password is reset in iFHIR. Here is your username and password.<br/><br/>' +
      'Username: '+email+'<br/>'+
      'Password: '+newPassword+'<br/><br/>'+
      'Click on below link :'+
      '<i>'+baseUrlForPasswordReset+'</i>'+'<br/><br/>'+
      'Thanks,<br/>'+
      'Adminstrator<br/>'+
      'rakfhir@gmail.com'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      }else{
      }
    });

  },

  submitTestMail:function(data){

    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      auth: {
        user: supportMail,
        pass: supportPass
      }
    }));
    var mailOptions = {
      from: supportMail, // sender address
      to: 'rakfhir@gmail.com', // list of receivers
      subject: data.qsname + ' Test Result', // Subject line
      html:
      'User name       : '+data.name+'<br/>'+
      'Total Questions : '+data.len+'<br/>'+
      'Correct Answer  : '+data.score+'<br/>'+
      'Wrong Answer    : '+(data.len-data.score)+'<br/>'+
      'Score           : '+Math.round((data.score*100)/data.len)+'<br/>'

    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      }else{
      }
    });

  },

};

module.exports = EmailService;
