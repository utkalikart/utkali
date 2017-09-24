/**
 * Created by Nrusingh on 2/25/17.
 */
'use strict';
var cumodel = require('./createUser-model');
var mongodb = require('../../models/mongodbConnection.js');
var _ = require('underscore');
var Ajv = require('ajv');
var fs = require('fs');
var Busboy = require('busboy');
var mv = require('mv');
var bcrypt=require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);

exports.getUsers_Roles = function(req,res) {
  db.collection('User').find().toArray(function (error, userdata) {
      db.collection('role').find().toArray(function (error, roledata) {
        res.status(200).json({userdata: userdata,roledata: roledata});
      });
  });
}

exports.getAllImage = function(req,res) {
    db.collection('FileStoreKeeper').find().toArray(function (error, allFileData) {
      if(error){

      }else{
        db.collection('e_shopping_category').find().toArray(function (error,result) {
          if(error){

          }else{
            db.collection('e_shopping_sub_category').find().toArray(function (error,subCategoryResult) {
              if(error){

              }else{
                db.collection('e_shopping_brand').find().toArray(function (error,brandResult) {
                    if(error){

                    }else{
                      db.collection('e_shopping_size').find().toArray(function (error,sizeResult) {
                        if(error){

                        }else{
                          db.collection('FileStoreKeeper').find().sort({price:1}).toArray(function(err, ltoHData){
                            if(err){

                            }else{

                              db.collection('FileStoreKeeper').find().sort({price:-1}).toArray(function(err, htoLData){
                                if(err){

                                }else{
                                  res.status(200).json({allFileData: allFileData,result:result,subCategoryResult:subCategoryResult,brandResult:brandResult,sizeResult:sizeResult,ltoHData:ltoHData,htoLData:htoLData});
                                }

                              });
                            }

                          });

                        }

                      });

                    }

                });


              }

            });
          }

        });
      }

    });

}

exports.createUserAdminProcess = function(req,res) {
  //busboy get file data from request and  write to  respective folder
  var username    = req.headers.username;
  var firstname   = req.headers.firstname;
  var middlename  = req.headers.middlename;
  var lastname    = req.headers.lastname;
  var email       = req.headers.email;
  var password    = req.headers.password;
  var Role        = req.headers.rolelist;
  var phone       = req.headers.phone;
  email           = email.toLowerCase();
  var temp_fileName='';
  db.collection('User').find({email:email},{_id:1}).limit(1).toArray(function(err,userInfo) {
      if(err || userInfo.length > 0) {
        return res.json({save:false,msg:'Email id already registered'});
      } else {
        var uploadFilename = "";
        var fileData = "";
        var busboy = new Busboy({ headers: req.headers });

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          uploadFilename = filename;
          var FileName = uploadFilename;
          var UserName = (req.session.user == undefined) ? '' : req.session.user.firstname;
          var currentDate = new Date();
          var timestamp = currentDate.valueOf().toString();
          temp_fileName = UserName+'_'+timestamp+'_'+filename;
          file.pipe(fs.createWriteStream("./client/assets/images/uploaded/"+temp_fileName));
          file.on('data', function(data) {
            fileData += data;
          });
          file.on('end', function() {
            console.log("fileuploaded successfully")
          });
        });
        busboy.on('finish', function() {
              if(typeof Role == "string") {
                Role = JSON.parse(Role);
              }

              if(isNaN(phone)) {
                console.log("phone is not a number");
                phone = ""
              }

              var _role;
              var _roleid = ''+Role.roleId;
              var _rolename = Role.name;
              var newhash;
              var status = false;
              bcrypt.genSalt(10, function(err, salt) {
                if(err) {
                  console.log(err);
                } else {
                  bcrypt.hash(password, salt, function(err, hash) {
                    if(err) {
                      console.log(err);
                    } else {
                      newhash=hash;
                      status=true;
                      db.collection('role').find({roleId:_roleid}).toArray(function(find_error,find_result) {
                        if (find_error) {
                          console.log(find_error);
                        } else {

                          var param = {
                            username:username,
                            firstname:firstname,
                            lastname:lastname,
                            email:email,
                            password:newhash,
                            isActive :true,
                            role:find_result,
                            phone:phone,
                            pp:"/assets/images/uploaded/"+temp_fileName
                          }

                          db.collection('User').insert([param],function(error,result) {
                            if(error) {
                              console.log(error);
                            } else {
                              res.json({save:true,msg:'success'});
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
        });
        return req.pipe(busboy);
      }
  });
};

var encryptPassword = exports.encryptPassword  = function(password,isNewPassword,cb) {
  if(isNewPassword == 0) {
    cb(1,password);
    return;
  }

  bcrypt.genSalt(10, function(err, salt) {
    if(err) {
      cb(0,err);
      console.log(err);
      return;
    } else {
      bcrypt.hash(password, salt, function(err, hash) {
        if(err) {
          cb(0,err);
          console.log(err);
          return;
        } else {
          cb(1,hash);
          return
        }
      });
    }
  });
};

exports.userUpdateProcess = function(req,res) {
  console.log("req,hr",req.headers);
  var username      = req.headers.username;
  var firstname     = req.headers.firstname;
  var middlename    = req.headers.middlename;
  var lastname      = req.headers.lastname;
  var email         = req.headers.email;
  var password      = req.headers.password;
  var Role          = req.headers.rolelist;
  var phone         = req.headers.phone;
  var userUniqueId  = req.headers.useruniqueid;

  if(typeof Role == "string") {
    Role= JSON.parse(Role);
  }

  var _role;
  var _roleid=''+Role.roleId;
  var _rolename=Role.name;

  var newhash;
  var status=false;
  db.collection('User').find({password:password},{_id:1}).toArray(function(err,userInfo){
    var isNewPassword = 1;
    if(!err && userInfo.length > 0) {
      isNewPassword = 0;
    }
    encryptPassword(password,isNewPassword,function(isOk,newPassword){
      if(isOk) {

          status=true;
          db.collection('role').find({roleId:_roleid}).toArray(function(find_error,find_result) {
            if (find_error) {
              console.log(find_error);
            } else {

              var setParam = {
                username:username,
                firstname:firstname,
                middlename:middlename,
                lastname:lastname,
                email:email,
                isActive :true,
                role:find_result,
                phone:phone
              };

              if(isNewPassword == 1) {
                 setParam["password"] = newPassword;
              }
              console.log("user update process -- "+userUniqueId);
              db.collection('User').update({_id:ObjectID(userUniqueId)},{$set:setParam},function(error,result) {
                if(error) {
                  console.log(error);
                } else {
                  res.json({save:true,msg:'success'});
                }
              });
            }
          });
      } else {
        console.log(newPassword);
      }
    })
  });
};

exports.userDeleteProcess = function(req,res) {
  var userUniqueId=req.body.userUniqueId;

  if(typeof userUniqueId == "undefined" || userUniqueId == null || userUniqueId == "" || userUniqueId.length != 24) {
      res.json({save:false,msg:'Wrong Unique Id'});
      return;
  }

  db.collection('User').remove({_id:ObjectID(userUniqueId)},function(err,data) {
    if(err) {
      console.log(err);
    } else {
      res.json({save:true,msg:'successful'});
    }
  });
}

exports.imageUploadAdminProcess = function(req,res) {
  var  userInfo = req.session.user;

  if(typeof userInfo == "undefined" || userInfo == null || userInfo == "" || typeof userInfo._id == "undefined") {
    res.status(401).send("Failed");
    return;
  }

  //busboy get file data from request and  write to  respective folder
  var temp_fileName='';
  var UserName='';
  var userId = userInfo._id;
  var uploadFilename = "";
  var fileData = "";
  var busboy = new Busboy({ headers: req.headers });

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    uploadFilename = filename;
    var FileName = uploadFilename;
    UserName = (req.session.user == undefined) ? '' : req.session.user.firstname;
    var currentDate = new Date();
    var timestamp = currentDate.valueOf().toString();
    temp_fileName = UserName+'_'+timestamp+'_'+filename;
    file.pipe(fs.createWriteStream("./client/assets/images/uploaded/"+temp_fileName));
    file.on('data', function(data) {
      fileData += data;
    });
    file.on('end', function() {
      console.log("fileuploaded successfully")
    });
  });

  busboy.on('finish', function() {
    var pp = "/assets/images/uploaded/"+temp_fileName;
    db.collection("User").update({ _id: ObjectID(userId) },{$set:{pp:pp}},function(iserr,updateResult) {
      if(iserr) {
        console.log(iserr);
      } else {
        console.log("image updated successfully");
        res.json({save:true,msg:'success',path:pp});
      }
    });
  });
  return req.pipe(busboy);
};

exports.fileUploadProcess = function(req,res) {
  var  userInfo = req.session.user;
  console.log(JSON.stringify(req.headers))
  var price=req.headers.price;
  var productName=req.headers.productname;
  var quantity=req.headers.quantity;
  var vendorName=req.headers.vendorname;
  var categoryName=req.headers.categoryname;
  var subCategoryName=req.headers.subcategoryname;
  var brandName=req.headers.brandname;
  var colorName=req.headers.colorname;
  console.log(productName+price)
  if(typeof userInfo == "undefined" || userInfo == null || userInfo == "" || typeof userInfo._id == "undefined") {
    res.status(401).send("Failed");
    return;
  }

  //busboy get file data from request and  write to  respective folder
  var temp_fileName='';
  var UserName='';
  var userId = userInfo._id;
  var uploadFilename = "";
  var fileData = "";
  var busboy = new Busboy({ headers: req.headers });

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    uploadFilename = filename;
    var FileName = uploadFilename;
    UserName = (req.session.user == undefined) ? '' : req.session.user.firstname;
    var currentDate = new Date();
    var timestamp = currentDate.valueOf().toString();
    temp_fileName = UserName+'_'+timestamp+'_'+filename;
    file.pipe(fs.createWriteStream("./client/assets/images/uploaded/"+temp_fileName));
    file.on('data', function(data) {
      fileData += data;
    });
    file.on('end', function() {
      console.log("fileuploaded successfully")
    });
  });

  busboy.on('finish', function() {
    var pp = "/assets/images/uploaded/"+temp_fileName;
    var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var n = month[d.getMonth()];
    var setParam = {

    }
    db.collection("FileStoreKeeper").insert({UserId:userId,pp:pp,price:parseInt(price),productName:productName,quantity:parseInt(quantity),TotalQuantity:parseInt(quantity),vendorName:vendorName,Month:n,categoryName:categoryName,subCategoryName:subCategoryName,brandName:brandName,colorName:colorName},function(iserr,updateResult) {
      if(iserr) {
        console.log(iserr);
      } else {
        res.json({save:true,msg:'success',path:pp});
      }
    });
  });
  return req.pipe(busboy);
};

exports.getProductDetails = function(req,res) {
  var pId=req.body.pId;
  if(typeof pId == "undefined" || pId == null || pId == "" || pId.length != 24) {
    res.json({save:false,msg:'Wrong Unique Id'});
    return;
  }
  db.collection('FileStoreKeeper').findOne({_id:ObjectID(pId)},function (error, singleProduct){
    if (error) {
      console.log("-----------------------------------error::::"+error)
    } else {
      res.json({save:true, singleProduct: singleProduct});


    }
  });
};

exports.sortPriceLowToHighProcess = function(req,res) {
  db.collection('FileStoreKeeper').find().sort({price:1}).toArray(function(err, sortedData){
    if (err) {
      console.log("-----------------------------------error::::"+err)
    } else {
      res.json({save:true, data: sortedData});
    }
  });
};

exports.sortPriceHighToLowProcess = function(req,res) {
  db.collection('FileStoreKeeper').find().sort({price:-1}).toArray(function(err, sortedData1){
    if (err) {
      console.log("-----------------------------------error::::"+err)
    } else {
      res.json({save:true, data: sortedData1});
    }
  });
};

exports.continueRegistrationProcess = function(req,res) {
  var name=req.body.name;
  var mobno=req.body.mobno;
  var email=req.body.email;
  var password=req.body.password;
  var param = {
    c_name:name,
    c_mobno:mobno,
    c_email:email,
    c_password:password
  }

  db.collection('e_shopping_register').insert([param],function(error,result) {
    if(error) {
      console.log(error);
    } else {
      res.json({save:true,msg:'register successful!!!',result:result});
    }
  });
};

exports.continueLoginProcess = function(req,res) {
  var mobno=req.body.mobno;
  var password=req.body.password;

  db.collection('e_shopping_register').findOne({$and:[{c_mobno:mobno}]}, {}, { sort: { 'created_at' : -1 } }, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      if(mobno==user.c_mobno && password==user.c_password){
        res.json({save:true,msg:'login successful!!!'});
      }else{
        res.json({save:false,msg:'login failed!!!'});
      }

    }
  });
};

exports.saveDeliveryAddressProcess = function(req,res) {
  var name=req.body.name;
  var address1=req.body.address1;
  var address2=req.body.address2;
  var city=req.body.city;
  var district=req.body.district;
  var state=req.body.state;
  var pin=req.body.pin;
  var phone=req.body.phone;
  var currentCustomerId=req.body.currentCustomerId;

  var param = {
    currentCustomerId:currentCustomerId,
    d_name:name,
    d_address1:address1,
    d_address2:address2,
    d_city:city,
    d_district:district,
    d_state:state,
    d_pin:pin,
    d_phone:phone
  }
  db.collection('e_shopping_deliver_address').insert([param],function(error,result) {
    if(error) {
      console.log(error);
    } else {
      res.json({save:true,msg:'address successful!!!',deliveryData:result});
    }
  });
};

exports.checkDeliveryPinProcess=function(req,res){
  var pin=req.body.pin;
  db.collection('e_shopping_delivery_pin').findOne({delivery_pin:pin},function (error, pinData){
    if (error) {
      console.log("-----------------------------------error::::"+error)
    }if(pinData==null) {
      res.json({save: false, message: 'Delivery not Possible'});
    }
    else {
     /*if(pinData==null){
        res.json({save:false,message:'Delivery not Possible'});
      }*/
      res.json({save:true, pinData: pinData,message:'Delivery Possible'});
    }
  });
}

exports.savedDoctorRegistrationProcess=function(req,res){
  var doctorName=req.body.doctorName;

  var param = {
    name:doctorName
  };

  /*db.collection('t_doctor').find(param,{_id:1}).limit(1).toArray(function(error,doctorData){
   if(error){
   console.log("error"+error);
   } else {

   if(doctorData.length > 0){
   res.json({save:"duplicate",msg:'failed'});
   }else{
   var insert_data = {
   name : doctorName
   }*/
  db.collection('e_shopping_category').insert(param,function(err1, res1){
    if(err1){
    }else{
      console.log('saved data successfully!!!!!!')
      res.json({save:true,msg:'successful'});
    }
  })
  // }
  // }
  // });
};

exports.doctorUpdateProcess = function(req,res) {
  var doctorName=req.body.doctorName;
  var doctorUniqueId = req.body.doctorUniqueId;

  if(typeof doctorUniqueId == "undefined" || doctorUniqueId == null || doctorUniqueId == "" || doctorUniqueId.length != 24) {
    res.json({save:false,msg:'state Not Found'});
    return;
  }

  var param = {
    _id:ObjectID(doctorUniqueId)
  };

  var setParam = {
    name : doctorName
  }
  db.collection('e_shopping_category').find({name:doctorName}).limit(1).toArray(function(error,doctorData) {
    if(error){
      console.log("error"+error);
    } else {
      if(doctorData.length > 0 && doctorData[0]._id.toString() != doctorUniqueId) {
        res.json({save:"duplicate",msg:'failed'});
      }else{
        db.collection('e_shopping_category').update(param,{$set:setParam},function(error,doctorData) {
          if(error) {
            console.log("error"+error);
          } else {
            setParam["_id"] = ObjectID(doctorUniqueId);
            db.collection('role').update({ _id :ObjectID(doctorUniqueId)},{$set:{'doctorName':doctorName}},{multi:true},{w:0});

            if(doctorData.result.n == 1) {
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

exports.doctorDeleteProcess = function(req,res) {
  var doctorId = req.body.doctorId;

  if(typeof doctorId == "undefined" || doctorId == null || doctorId == "" || doctorId.length != 24) {
    res.json({save:false,msg:'something went wrong'});
    return;
  }

  var param = {
    _id:ObjectID(doctorId)
  };

  db.collection('e_shopping_category').remove(param,function(error,result) {
    if(error) {
      console.log(error);
    } else {
      res.json({save:true,msg:'successful'});
    }
  });
};

exports.searchAllItemProcess=function(req,res){
  var searchItem=req.body.searchItem;
  console.log(searchItem)
  db.collection('FileStoreKeeper').find({'productName': new RegExp(searchItem, 'i')}).toArray(function (error,searchData) {
    if(error){

    }else{
      res.status(200).json({searchData:searchData});
    }

  });
};

exports.findProductsProcess=function(req,res){
  var searchName=req.body.searchName;
  console.log(searchName);

  db.collection('FileStoreKeeper').find({subCategoryName:searchName}).toArray(function (error,productData) {
    if(error){

    }else{
      res.status(200).json({save:true,productData:productData});
    }

  });
};

exports.subCategoryRegistrationProcess=function(req,res){
  var doctorName=req.body.doctorName;

  var param = {
    name:doctorName
  };

  db.collection('e_shopping_sub_category').find(param,{_id:1}).limit(1).toArray(function(error,subCatData){
   if(error){
   console.log("error"+error);
   } else {

   if(subCatData.length > 0){
   res.json({save:"duplicate",msg:'failed'});
   }else{
   var insert_data = {
   name : doctorName
   }
  db.collection('e_shopping_sub_category').insert(param,function(err1, res1){
    if(err1){
    }else{
      console.log('saved data successfully!!!!!!')
      res.json({save:true,msg:'successful'});
    }
  })
   }
   }
  });
};

exports.subCategoryUpdateProcess = function(req,res) {
  var doctorName=req.body.doctorName;
  var doctorUniqueId = req.body.doctorUniqueId;

  if(typeof doctorUniqueId == "undefined" || doctorUniqueId == null || doctorUniqueId == "" || doctorUniqueId.length != 24) {
    res.json({save:false,msg:'state Not Found'});
    return;
  }

  var param = {
    _id:ObjectID(doctorUniqueId)
  };

  var setParam = {
    name : doctorName
  }
  db.collection('e_shopping_sub_category').find({name:doctorName}).limit(1).toArray(function(error,doctorData) {
    if(error){
      console.log("error"+error);
    } else {
      if(doctorData.length > 0 && doctorData[0]._id.toString() != doctorUniqueId) {
        res.json({save:"duplicate",msg:'failed'});
      }else{
        db.collection('e_shopping_sub_category').update(param,{$set:setParam},function(error,doctorData) {
          if(error) {
            console.log("error"+error);
          } else {
            setParam["_id"] = ObjectID(doctorUniqueId);
            db.collection('role').update({ _id :ObjectID(doctorUniqueId)},{$set:{'doctorName':doctorName}},{multi:true},{w:0});

            if(doctorData.result.n == 1) {
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

exports.subCategoryDeleteProcess = function(req,res) {
  var doctorId = req.body.doctorId;

  if(typeof doctorId == "undefined" || doctorId == null || doctorId == "" || doctorId.length != 24) {
    res.json({save:false,msg:'something went wrong'});
    return;
  }

  var param = {
    _id:ObjectID(doctorId)
  };

  db.collection('e_shopping_sub_category').remove(param,function(error,result) {
    if(error) {
      console.log(error);
    } else {
      res.json({save:true,msg:'successful'});
    }
  });
};

exports.sortInStockProductProcess=function(req,res){
  db.collection('FileStoreKeeper').find({ quantity: { $gt: 0 } }).toArray(function(err, inStockData){
    if (err) {
      console.log("-----------------------------------error::::"+err)
    } else {
      res.json({save:true, data: inStockData});
    }
  });
};

exports.sortOutOfStockProductProcess=function(req,res){
  db.collection('FileStoreKeeper').find({ quantity: { $eq: 0 } }).toArray(function(err, outOfStockData){
    if (err) {
      console.log("-----------------------------------error::::"+err)
    } else {
      res.json({save:true, data: outOfStockData});
    }
  });
};

exports.sorBothProductProcess=function(req,res){
  db.collection('FileStoreKeeper').find().toArray(function(err, bothStockData){
    if (err) {
      console.log("-----------------------------------error::::"+err)
    } else {
      res.json({save:true, data: bothStockData});
    }
  });
};


exports.brandRegistrationProcess=function(req,res){
  var doctorName=req.body.doctorName;

  var param = {
    name:doctorName
  };

 db.collection('e_shopping_brand').find(param,{_id:1}).limit(1).toArray(function(error,subCatData){
    if(error){
      console.log("error"+error);
    } else {

      if(subCatData.length > 0){
        res.json({save:"duplicate",msg:'failed'});
      }else{
        var insert_data = {
          name : doctorName
        }
        db.collection('e_shopping_brand').insert(param,function(err1, res1){
          if(err1){
          }else{
            console.log('saved data successfully!!!!!!')
            res.json({save:true,msg:'successful'});
          }
        })
      }
    }
  });
};

exports.brandUpdateProcess = function(req,res) {
  var doctorName=req.body.doctorName;
  var doctorUniqueId = req.body.doctorUniqueId;

  if(typeof doctorUniqueId == "undefined" || doctorUniqueId == null || doctorUniqueId == "" || doctorUniqueId.length != 24) {
    res.json({save:false,msg:'state Not Found'});
    return;
  }

  var param = {
    _id:ObjectID(doctorUniqueId)
  };

  var setParam = {
    name : doctorName
  }
  db.collection('e_shopping_brand').find({name:doctorName}).limit(1).toArray(function(error,doctorData) {
    if(error){
      console.log("error"+error);
    } else {
      if(doctorData.length > 0 && doctorData[0]._id.toString() != doctorUniqueId) {
        res.json({save:"duplicate",msg:'failed'});
      }else{
        db.collection('e_shopping_brand').update(param,{$set:setParam},function(error,doctorData) {
          if(error) {
            console.log("error"+error);
          } else {
            setParam["_id"] = ObjectID(doctorUniqueId);
            db.collection('role').update({ _id :ObjectID(doctorUniqueId)},{$set:{'doctorName':doctorName}},{multi:true},{w:0});

            if(doctorData.result.n == 1) {
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

exports.brandDeleteProcess = function(req,res) {
  var doctorId = req.body.doctorId;

  if(typeof doctorId == "undefined" || doctorId == null || doctorId == "" || doctorId.length != 24) {
    res.json({save:false,msg:'something went wrong'});
    return;
  }

  var param = {
    _id:ObjectID(doctorId)
  };

  db.collection('e_shopping_brand').remove(param,function(error,result) {
    if(error) {
      console.log(error);
    } else {
      res.json({save:true,msg:'successful'});
    }
  });
};

exports.sortItemBrandWiseProcess= function (req, res) {
  var brandName=req.body.brandName;
  db.collection('FileStoreKeeper').find({ brandName:brandName }).toArray(function(err, brandedData){
    if (err) {
      console.log("-----------------------------------error::::"+err)
    } else {
      res.json({save:true, data: brandedData});
    }
  });
}
exports.sortItemSizeWiseProcess= function (req, res) {
  var sizeName=req.body.sizeName;
  db.collection('FileStoreKeeper').find({ size:sizeName }).toArray(function(err, sizedData){
    if (err) {
      console.log("-----------------------------------error::::"+err)
    } else {
      res.json({save:true, data: sizedData});
    }
  });
}
exports.sortItemColorWiseProcess= function (req, res) {
  var colorName=req.body.colorName;
  db.collection('FileStoreKeeper').find({ colorName:colorName }).toArray(function(err, coloredData){
    if (err) {
      console.log("-----------------------------------error::::"+err)
    } else {
      res.json({save:true, data: coloredData});
    }
  });
}


exports.sizeRegistrationProcess=function(req,res){
  var doctorName=req.body.doctorName;

  var param = {
    name:doctorName
  };

 db.collection('e_shopping_size').find(param,{_id:1}).limit(1).toArray(function(error,subCatData){
    if(error){
      console.log("error"+error);
    } else {

      if(subCatData.length > 0){
        res.json({save:"duplicate",msg:'failed'});
      }else{
        var insert_data = {
          name : doctorName
        }
        db.collection('e_shopping_size').insert(param,function(err1, res1){
          if(err1){
          }else{
            console.log('saved data successfully!!!!!!')
            res.json({save:true,msg:'successful'});
          }})
      }
    }
  });
};

exports.sizeUpdateProcess = function(req,res) {
  var doctorName=req.body.doctorName;
  var doctorUniqueId = req.body.doctorUniqueId;

  if(typeof doctorUniqueId == "undefined" || doctorUniqueId == null || doctorUniqueId == "" || doctorUniqueId.length != 24) {
    res.json({save:false,msg:'state Not Found'});
    return;
  }

  var param = {
    _id:ObjectID(doctorUniqueId)
  };

  var setParam = {
    name : doctorName
  }
  db.collection('e_shopping_size').find({name:doctorName}).limit(1).toArray(function(error,doctorData) {
    if(error){
      console.log("error"+error);
    } else {
      if(doctorData.length > 0 && doctorData[0]._id.toString() != doctorUniqueId) {
        res.json({save:"duplicate",msg:'failed'});
      }else{
        db.collection('e_shopping_size').update(param,{$set:setParam},function(error,doctorData) {
          if(error) {
            console.log("error"+error);
          } else {
            setParam["_id"] = ObjectID(doctorUniqueId);
            db.collection('role').update({ _id :ObjectID(doctorUniqueId)},{$set:{'doctorName':doctorName}},{multi:true},{w:0});

            if(doctorData.result.n == 1) {
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

exports.sizeDeleteProcess = function(req,res) {
  var doctorId = req.body.doctorId;

  if(typeof doctorId == "undefined" || doctorId == null || doctorId == "" || doctorId.length != 24) {
    res.json({save:false,msg:'something went wrong'});
    return;
  }

  var param = {
    _id:ObjectID(doctorId)
  };

  db.collection('e_shopping_size').remove(param,function(error,result) {
    if(error) {
      console.log(error);
    } else {
      res.json({save:true,msg:'successful'});
    }
  });
};

exports.sortPriceRangeProcess=function(req,res){
  var maxValue=req.body.maxValue;
  var minValue=req.body.minValue;
  console.log(maxValue)
  console.log(minValue)
  db.collection('FileStoreKeeper').find({price: {"$gte": minValue, "$lt": maxValue}}).toArray(function(err, rangeData){
    if (err) {
      console.log("-----------------------------------error::::"+err)
    } else {
      console.log('^^^^^^^^^^^^^^^^'+JSON.stringify(rangeData));
      res.json({save:true, data: rangeData});
    }
  });
}

exports.updateDealsOfTheDayDetails=function(req,res){
  var vId=req.body.vId;
  var discount=req.body.discount;
  if(typeof vId == "undefined" || vId == null || vId == "" || vId.length != 24) {
    res.json({save:false,msg:'state Not Found'});
    return;
  }
  var param = {
    _id:ObjectID(vId)
  };

  var setParam = {
    discount:req.body.discount
  }
  db.collection('FileStoreKeeper').update(param,{$set:setParam},function(error,result) {
    if(error) {
      console.log("error"+error);
    } else {
        res.json({save:true,msg:'something went wrong'});
    }
  });
}
function handleError(res, err) {
  return res.status(500).send(err);
}
