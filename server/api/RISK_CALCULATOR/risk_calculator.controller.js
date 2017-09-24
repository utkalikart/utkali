'use strict';


exports.getScore = function(req,res) {
  var  userInfo = req.session.user;

  if(typeof userInfo == "undefined" || userInfo == null || userInfo == "" || typeof userInfo._id == "undefined") {
    res.status(401).send("Failed");
    return
  } else {
    var gender           = req.body.gender.toUpperCase();
    var Patientient_Race = req.body.Patientient_Race;

    db.collection("t_RISE").find({}).toArray(function(err,riseData){
      if(!err) {          
        var riseData = riseData[0];
        var totalRisk = 0;
        if(gender == "MALE" || gender == "M") {
          totalRisk += parseFloat( riseData["NCH_PTNT_STATUS_IND_CDC"]["Est"]);
          console.log("::"+totalRisk)
        } else if(gender == "FEMALE" || gender == "F") {
          totalRisk += parseFloat(riseData["NCH_PTNT_STATUS_IND_CDB"]["Est"]);         
          console.log("::"+totalRisk)          
        } 
        for(var i=0;i<Patientient_Race.length;i++) {
          if(Patientient_Race[i].toUpperCase() == "BLACK") {
            totalRisk +=parseFloat( riseData["BENE_RACE_CD3"]["Est"]);
          console.log("::"+totalRisk)

          } else if(Patientient_Race[i].toUpperCase() == "ASIAN") {
            totalRisk += parseFloat(riseData["BENE_RACE_CD4"]["Est"]);            
          console.log("::"+totalRisk)

          }
        }
        var pertageOfTotalRisk = totalRisk*100;
        return res.status(200).send({save:true,risk:pertageOfTotalRisk});   
      } else {
        return res.status(200).send({save:false,msg:"Some thing went wrong"});    
      }
    })
  }
};

function handleError(res, err) {
  return res.status(500).send(err);
}
