/**
 * Created by nrusingh on 2/24/2017.
 */
 
'use strict';
var mongodb = require('../../models/mongodbConnection.js');
exports.getUsers = function(req,res) {
  db.collection('User').find().toArray(function (error, userdt) {
    db.collection('role').find().toArray(function (error, roledt) {
      res.status(200).json({userdata:userdt, roledata:roledt});
    });
  });
};

exports.userSavedProcess = function(req,res) {
  var username=req.body.username;
  var rx=req.body.clinicalArchitecture1;
  var roleid=req.body.roleid;

    db.collection('role').find({roleId:roleid}).toArray(function(roleerr,roledata){
      if(roleerr){
      }else{
        var param={
          role:roledata
        }
        db.collection('User').update({firstname:username},{$set:param},function(usererr, userdata){
          if(usererr){
          }else{
            res.json({save:true,msg:'successful'});
          }
        })
      }
    });  
};

function handleError(res, err) {
  return res.status(500).send(err);
}

