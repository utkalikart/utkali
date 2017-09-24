//getRoles

'use strict';
var mongodb = require('../../models/mongodbConnection.js');

exports.getRoles_Permissions = function(req,res) {
    db.collection('role').find().toArray(function (roleerr, roledata) {
      if(roleerr) {
        console.log('err - '+roleerr);
      } else {             
        db.collection('permissions').find().toArray(function (permerr, permissiondata) {
          if(permerr) {
            console.log("permerr - "+permerr);
          } else {          
            res.status(200).json({roleData:roledata, permissionData: permissiondata});          
          }
        });          
      }       
    });
};

exports.roleSavedProcess = function(req,res) {
  var rolname=req.body.rolname;
  var selectedIds=req.body.selected_permissions_id;  
  for(var i=0;i<selectedIds.length;i++) {
    selectedIds[i] = ObjectID(selectedIds[i]);
  }

  var permission_array = [];
  if(selectedIds.length > 0) {
      var param = {
        name:rolname
      }
      db.collection('permissions').find({_id:{$in:selectedIds}}).toArray(function(perm_error,permission_array) {
        if(perm_error) {
          console.log("perm_error - "+perm_error);
        } else {          
          var currentDate = new Date();
          param["roleId"]= currentDate.valueOf().toString();
          param["permissionList"]=permission_array;
          db.collection('role').find({name:rolname},{_id:1}).limit(1).toArray(function(roleerror,roleData){
            if(roleerror) {
              console.log(roleerror);
            } else if(roleData.length > 0) {
              res.json({save:false,msg:'Role name already assigned to other user'});
            } else {
              db.collection('role').insert(param,function(error,result) {
                if(error) {
                  console.log("error - "+error);
                } else {
                  res.json({save:true,msg:'successful'});
                }
              });
            }
          });          
        }
      });    
  } else {
    res.json({save:false,msg:'Role save failed.No permissions selected.'});
  }
};

exports.roleUpdateProcess = function(req,res) {
  var rolname=req.body.rolname;
  var roleUniqueId = req.body.roleUniqueId;
  var selectedIds=req.body.selected_permissions_id;  

  if(typeof roleUniqueId == "undefined" || roleUniqueId == null || roleUniqueId == "" || roleUniqueId.length != 24) {
    res.json({save:false,msg:'Role name already assigned to other user'});
    return;
  }

  for(var i=0;i<selectedIds.length;i++) {
    selectedIds[i] = ObjectID(selectedIds[i]);
  }

  var permission_array = [];
  if(selectedIds.length > 0) {
      var param = {
        name:rolname
      }
      db.collection('permissions').find({_id:{$in:selectedIds}}).toArray(function(perm_error,permission_array) {
        if(perm_error) {
          console.log("perm_error - "+perm_error);
        } else {          
          param["permissionList"]=permission_array;
          db.collection('role').update({_id:ObjectID(roleUniqueId)},{$set:param},function(roleerror,roleUpdateData){
            if(roleerror) {
              console.log(roleerror);
            } else if(roleUpdateData.result.n) {
              db.collection('User').update({ "role._id" :ObjectID(roleUniqueId)},{$set:{'role.$.name':rolname,'role.$.permissionList':permission_array}},{multi:true},{w:0});

              res.json({save:true,msg:'successful'});              
            } else {
              res.json({save:false,msg:'No permissions found'});              
            }
          });          
        }
      });    
  } else {
    res.json({save:false,msg:'Role save failed.No permissions selected.'});
  }
};

exports.roleDeleteProcess = function(req,res) {
    var roleUniqueId=req.body.roleUniqueId;
    if(typeof roleUniqueId == "undefined" || roleUniqueId == null || roleUniqueId == "" || roleUniqueId.length != 24) {
        res.json({save:false,msg:'successful'});
    }
    var param = {
      _id:ObjectID(roleUniqueId)
    };

    db.collection('User').find({"role._id":ObjectID(roleUniqueId)},{_id:1}).limit(1).toArray(function(error,userRoleCount){
      
      if(!error && userRoleCount.length == 0) {
        db.collection('role').remove(param,function(error,result) {
          if(error) {
            console.log("error - "+error);
          } else {
            res.json({save:true,msg:'successful'});
          }
        });
      } else {
        res.json({save:false,msg:"Can't delete because role used by some other user"});
      }
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

