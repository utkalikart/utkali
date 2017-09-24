/**
 * Created by Nrusingh on 2/25/17.
 */
'use strict';
var mySQLConnection = require('../../models/mysqlConnection.js');

exports.getclinicalCount = function(req,res) {
  var  userInfo = req.session.user;

  if(typeof userInfo == "undefined" || userInfo == null || userInfo == "" || typeof userInfo._id == "undefined") {
    res.status(401).send("Failed");
    return
  } else {
  	var countQueryRxnorm   = 'select (select  count(*) from rxtermsarchive) as count';
   	countQueryRxnorm 	   +=	', (select  count(*)  from rxtermsingredients) as count1';
   	countQueryRxnorm 	   +=	', (select  count(*)  from rxterms) as count2 ';
  	var countQuerySnomedCT = 'select  count(*) as count from terminology_sct2_description_full ';
  	var countQueryICD   = 'select (select  count(*) from tb_icd_blocksdata) as count';
   	countQueryICD 	   +=	', (select  count(*)  from tb_icd_chaptersdata) as count1';
   	countQueryICD 	   +=	', (select  count(*)  from tb_icd_codedata) as count2 ';
  	var countQueryLONIC    = 'select  count(*) as count from loinc ';
  	var allCounts = {
  		icdcount      : 0,
  		loniccount    : 0,
  		snomedctcount : 0,
  		rxnormcount   : 0
  	}
	connection.query(countQueryRxnorm, function (error, rxnormCounts, fields) {
	    if (error) throw error;

	    allCounts["rxnormcount"] = rxnormCounts[0].count + rxnormCounts[0].count1 + rxnormCounts[0].count2;

	  	connection.query(countQuerySnomedCT, function (error, snomedctCounts, fields) {
		    if (error) throw error;
		    allCounts["snomedctcount"] = snomedctCounts[0].count;

		  	connection.query(countQueryLONIC, function (error, lonicCounts, fields) {
			    if (error) throw error;
			    allCounts["loniccount"] = lonicCounts[0].count;

			  	connection.query(countQueryICD, function (error, icdCounts, fields) {
				    if (error) throw error;
				    allCounts["icdcount"] = icdCounts[0].count + icdCounts[0].count1 + icdCounts[0].count2;
			    	return res.status(200).send(allCounts);
				});
			});
		});
	});

  }
}

exports.getAllScoredStudentData=function(req,res){
  db.collection('FileStoreKeeper').find().toArray(function (err, markData) {
    if(err) {
      console.log("err - "+err);
    } else {
      res.status(200).json({ markData: markData});
    }
  });
}

exports.searchPatientProcess = function(req,res) {

  var queryParam={};
  if(req.body.year !=undefined){
    queryParam.year=req.body.year;
  }if(req.body.department !=undefined){
    queryParam.department=req.body.department;
  }

  /*db.users.find({ "local.username" : {$regex:"^[a-z , A-Z]" }})*/
  db.collection('User').find(queryParam).toArray(function(err,getAllRecords) {
    if(err){
      throw  err;
    }
    if(getAllRecords == undefined || getAllRecords == null || getAllRecords == '') {
      getAllRecords={};
      res.json({save:false,message:'Found Nothing..'});
    } else{
      res.json({save: true, 'getAllRecord': getAllRecords})
    }
  });
};

exports.individualPaymentReceivedData=function(req,res){
  var amount=parseInt(req.body.amount)/100;
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
  var param = {
    created_at            :   Date(),
    name                  :   req.body.name,
    email                 :   req.body.email,
    contact               :   req.body.contact,
    description           :   req.body.description,
    quantity              :   req.body.quantity,
    amount                :   amount+'.'+'00',
    transaction_Id        :   req.body.id,
    Month                 :   n
  }
  db.collection('t_billing').insert([param],function(error,result) {
    if(error) {
      return error;
    } else {
      db.collection('FileStoreKeeper').find({_id:ObjectID(req.body.productId)}).toArray(function(find_error,find_result) {
        if (find_error) {
          console.log(find_error);
        } else {

          var setParam = {};
          setParam["quantity"] = find_result[0].quantity-req.body.quantity;

          db.collection('FileStoreKeeper').update({_id:ObjectID(req.body.productId)},{$set:setParam},function(error1,result1) {
            if(error1) {
              console.log(error1);
            } else {
              res.json({save:true,msg:'payment received',result:result});
            }
          });
        }
      });

    }
  });
}

exports.getAllSuccessfulTransaction=function(req,res){
  var q="0";
  var pId=req.body.pId;
  var pName=req.body.pName;
  db.collection('t_billing').find().toArray(function (err, result) {
    if(err) {
      console.log("err - "+err);
    } else {
      db.collection('FileStoreKeeper').find({quantity:parseInt(q)}).toArray(function (err, result1) {

          if(err){
              console.log(+err);
          }
          else{
            db.collection('t_billing').find().toArray(function (err, result2) {
              if(err){

              }else{
                db.collection('FileStoreKeeper').find().toArray(function (err, result3) {
                  if(err){

                  }else{
                    db.collection('FileStoreKeeper').find({_id:ObjectID(pId)}).toArray(function (err, graphicalData) {
                      if(err) {
                        console.log("err - "+err);
                      } else {
                        db.collection('e_shopping_category').find().toArray(function (err, docData) {
                          if(err) {
                            console.log("err - "+err);
                          } else {
                            db.collection('e_shopping_sub_category').find().toArray(function (err,subCategoryData) {
                              if(err){
                                console.log("err - "+err);
                              }else{
                                db.collection('e_shopping_brand').find().toArray(function (err,brandData) {
                                  if(err){

                                  }else{
                                    db.collection('e_shopping_size').find().toArray(function (err,sizeData) {
                                      if(err){

                                      }else{
                                        console.log(JSON.stringify(sizeData));
                                        res.status(200).json({
                                          successfulTransaction: result,
                                          outOfStockProducts:result1,
                                          deliveryAddressForEachTransaction:result2,
                                          totalVendors:result3,
                                          graphicalData:graphicalData,
                                          docData:docData,
                                          brandData:brandData,
                                          sizeData:sizeData
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

            });

          };
      });
    }
  });
}

exports.getGraphicalDataAccordingToProduct=function(req,res){
  var pId=req.body.pId;
  var pName=req.body.pName;

  db.collection('FileStoreKeeper').find({_id:ObjectID(pId)}).toArray(function (err, graphicalData) {
    if(err) {
      console.log("err - "+err);
    } else {
      res.status(200).json({ graphicalData: graphicalData});
    }
  });
}

exports.getGraphicalDataMonthWiseAccordingToProduct=function(req,res){
  var pId=req.body.pId;
  var pName=req.body.pName;
  db.collection('FileStoreKeeper').find({productName:pName}).toArray(function (err, graphDataMonthWise) {
    if(err) {
      console.log("err - "+err);
    } else {
      res.status(200).json({ graphDataMonthWise: graphDataMonthWise});
    }
  });
}



function handleError(res, err) {
  return res.status(500).send(err);
}


