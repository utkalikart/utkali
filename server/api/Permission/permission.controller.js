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

exports.permissionSavedProcess = function(req,res) {
  var permissionname=req.body.permissionname;
  var permissiondisplayname=req.body.permissiondisplayname;
  var permissiondisplayname2=req.body.permissiondisplayname2;
  var permissionurl=req.body.permissionurl;  
  var param = {
    name:permissionname
  };

  db.collection('permissions').find(param).toArray(function(perm_error,perm_result){
    if(perm_error){
      console.log("perm_error"+perm_error);
    } else {
      var recods =Object.keys(perm_result).length;
      if(recods>0){
        res.json({save:"duplicate",msg:'failed'});
      }else{
        var insert_data = {
          name : permissionname,
          displayName : permissiondisplayname,
          displayName2 : permissiondisplayname2,
          permissionUrl : permissionurl
        }
        db.collection('permissions').insert(insert_data,function(err1, res1){
          if(err1){
          }else{
            res.json({save:true,msg:'successful'});
          }
        })
      }
    }
  });
};

exports.permissionUpdateProcess = function(req,res) {
  var permissionname=req.body.permissionname;
  var permissiondisplayname=req.body.permissiondisplayname;
  var permissiondisplayname2=req.body.permissiondisplayname2;
  var permissionurl=req.body.permissionurl;
  var permissionUniqueId = req.body.permissionUniqueId;

  if(typeof permissionUniqueId == "undefined" || permissionUniqueId == null || permissionUniqueId == "" || permissionUniqueId.length != 24) {
    res.json({save:false,msg:'Permission Not Found'});
    return;
  }

  var param = {
    _id:ObjectID(permissionUniqueId)
  };

  var setParam = {
    name : permissionname,
    displayName : permissiondisplayname,
    displayName2 : permissiondisplayname2,
    permissionUrl : permissionurl
  }
  db.collection('permissions').find({name:permissionname}).toArray(function(perm_error,recods) {
    if(perm_error){
      console.log("perm_error"+perm_error);
    } else {      
      if(recods.length > 0 && recods[0]._id.toString() != permissionUniqueId) {
        res.json({save:"duplicate",msg:'failed'});
      }else{
        db.collection('permissions').update(param,{$set:setParam},function(perm_error,perm_result) {
          if(perm_error) {
            console.log("perm_error"+perm_error);
          } else {  
              setParam["_id"] = ObjectID(permissionUniqueId);
              db.collection('role').update({ "permissionList._id" :ObjectID(permissionUniqueId)},{$set:{'permissionList.$':setParam}},{multi:true},{w:0});

              if(perm_result.result.n == 1) {
                res.json({save:true,msg:'successful'});            
              } else {
                res.json({save:false,msg:'something went wrong'});            
              }        
            }    
        });
      }
    }
  });
};

exports.permDeleteProcess = function(req,res) {
  var permissionId = req.body.permissionId;  

  if(typeof permissionId == "undefined" || permissionId == null || permissionId == "" || permissionId.length != 24) {
    res.json({save:false,msg:'something went wrong'});
    return;
  }

  var param = { 
    _id:ObjectID(permissionId)
  };

  db.collection('role').find({"permissionList._id":ObjectID(permissionId)},{_id:1}).limit(1).toArray(function(error,dependRoleCount) {
    if(!error && dependRoleCount.length == 0) {
      db.collection('permissions').remove(param,function(error,result) {
        if(error) {
          console.log(error);
        } else {
          res.json({save:true,msg:'successful'});
        }
      });
    } else {
      res.json({save:false,msg:'Some roles have this permission so first delete that role'});
    }
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

