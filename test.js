var _=require("underscore");
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

ObjectID = module.exports = mongo.ObjectID;

MongoClient.connect("mongodb://localhost/scaffold-dev", function(err, database) {
	  if (err) throw err;

    db = module.exports = database;
    var parentPath = "5843d49934ceb3216f0da0ce";
    var regex = '^'+parentPath+'.*';
  	db.collection('fhir_profile').find({parentIdPath:{$regex: regex, $options:"i"}}).toArray(function(nferr,profileData) {
    	if(nferr || profileData.length == 0) {
      		return res.status(200).json({error:"Profile not available"});
    	}

    	addFHIRDataTypesToResource(profileData,function(resourceDataTypesResult) {
    		for(var i=0;i<resourceDataTypesResult.length;i++) {
    			if((resourceDataTypesResult[i].type == "Resource" ||
    				resourceDataTypesResult[i].type == "root" ||
    				resourceDataTypesResult[i].type == "Resource Element") || (
    				typeof resourceDataTypesResult[i].node_type != "undefined") && resourceDataTypesResult[i].node_type == "Data Type Child")
    			{
    				console.log("--"+resourceDataTypesResult[i].nodeName)
    				//keep it
    			} else {
    				resourceDataTypesResult.splice(i,1);
    				i--;
    			}
    		}
    		for(var i=0;i<resourceDataTypesResult.length;i++) {
    			var isParentAvailable = _.where(resourceDataTypesResult,{_id:resourceDataTypesResult[i].parentId})
    			if(isParentAvailable.length == 0) {
    				var splitData = resourceDataTypesResult[i].parentIdPath.split(".");
    				console.log("splitData",resourceDataTypesResult[i].nodeName,splitData)
    				if(splitData.length>2) {
    					resourceDataTypesResult[i].parentId = splitData[splitData.length-3]
    				}
    			}
    		}

    		makeSchemaInput(resourceDataTypesResult,function(get) {
    			console.log("get -- ",JSON.stringify(get));
    		});
    	})
	 });
})




var makeSchemaInput = exports.makeSchemaInput = function(tempResult,cb) {

  var result = _.where(tempResult,{depth:1})
  //console.log("result"+JSON.stringify(result));
  var j=result.length;
  var finalSchema = {};

  console.log("result-"+JSON.stringify(result));
  if(j==0) {
    cb(finalSchema);
    return;
  }
    recur(j-1);
  function recur(j) {
    if(!_.isEmpty(finalSchema)) {

      if(typeof result[j].dataTypeName != "undefined" && result[j].dataTypeName!=null)
        finalSchema["type"] = result[j].dataTypeName;

    }
    makeSchema(tempResult,result[j]._id,function(data){
      if(finalSchema.hasOwnProperty("properties")){
        finalSchema["properties"][result[j].nodeName]=data;
      } else {
        finalSchema["properties"] = {};
        finalSchema["properties"][result[j].nodeName]=data
      }

      if(result[j].isRequired) {
        if(finalSchema.hasOwnProperty("required")) {
          finalSchema.required.push(result[j].nodeName)
        } else {
          finalSchema["required"] = [];
          finalSchema.required.push(result[j].nodeName);
        }
      }

      if(j<=0) {
        cb(finalSchema);
      } else {
        j--;
        recur(j);
      }
    })
  }
}

var makeSchema = exports.makeSchema = function(resource_types,id,cb){
  var schema = {};//final output schema

  var result = _.where(resource_types,{_id:id});

  if(result.length <= 0) {
    cb({});
    return;
  }

  if(typeof result[0].arrayOrObject != "undefined" && result[0].arrayOrObject == "Array") {
    schema["type"] = "array"
    schema["items"] = {type:"object"};
  }  else   if(typeof result[0].arrayOrObject != "undefined" && result[0].arrayOrObject == "Object") {
  	schema["type"] = "object";
  } else if(result[0].dataTypeName == "pattern") {
    schema["pattern"] = result[0].pattern;
  } else if(typeof result[0].dataTypeName != "undefined" && result[0].dataTypeName!=null){
    schema["type"] = result[0].dataTypeName;
  }


  var childResult = _.where(resource_types,{parentId:id});


  var an_result = _.where(resource_types,{oldId: result[0].dataTypeId});
  //childResult= childResult.concat(an_result);

  //console.log("parentId 0 "+id + " - name - "+result[0].nodeName + " - child - "+JSON.stringify(childResult));

  var properties = {};
  if(childResult.length>0) {
    var i = childResult.length;
    rec(i-1);
    function rec(i) {
      properties[childResult[i].nodeName] = {"type":childResult[i].dataTypeName};
      makeSchema(resource_types,childResult[i]._id,function(data){
        //console.log("ch - "+JSON.stringify(childResult[i]));
        if(schema.hasOwnProperty("items")) {
          if(schema.hasOwnProperty("items") && schema.items.hasOwnProperty("properties")) {
            schema["items"]["properties"][childResult[i].nodeName] = data;
          } else {
            schema["items"]["properties"] = {};
            schema["items"]["properties"][childResult[i].nodeName]=data;
          }
          //console.log("ch 1- "+JSON.stringify(schema) + "= properties ="+JSON.stringify(properties));

          if(childResult[i].isRequired) {
            if(schema.hasOwnProperty("required")) {
              schema.items.required.push(childResult[i].nodeName);
            } else {
              schema["items"]["required"] = [];
              schema.items.required.push(childResult[i].nodeName);
            }
          }
        } else {
          if(schema.hasOwnProperty("properties")) {
            schema["properties"][childResult[i].nodeName]=data;
          } else {
            schema["properties"] = {};
            schema["properties"][childResult[i].nodeName]=data;
          }
          //console.log("ch2 - "+JSON.stringify(schema));

          if(childResult[i].isRequired) {
            if(schema.hasOwnProperty("required")) {
              schema.required.push(childResult[i].nodeName)
            } else {
              schema["required"] = [];
              schema.required.push(childResult[i].nodeName);
            }
          }
        }

        if(i<=0) {
          cb(schema);
          return;
        } else {
          i--;
          rec(i);
        }
      })
    }
  } else {
    cb(schema);
    return
  }
}

var addFHIRDataTypesToResource = exports.addFHIRDataTypesToResource = function(resourceDataTypes,cb) {
  var t=0;
  processDataTypes(t);
  function processDataTypes(t){
    if(resourceDataTypes[t].dataTypeId != "-1") {
      findDataType(resourceDataTypes,resourceDataTypes[t].dataTypeId,"",function(data) {
        if(data.dname!= "")
          resourceDataTypes[t].dataTypeName=data.dname;

        if(typeof data.arrayOrObject == "undefined" || data.arrayOrObject == "") {
            resourceDataTypes[t]["arrayOrObject"]="None";
        } else {
            resourceDataTypes[t]["arrayOrObject"]=data.arrayOrObject;
        }

        if(data.isPattern) {
          console.log(JSON.stringify(data)+" - patterdata - "+JSON.stringify(resourceDataTypes[t]));

          resourceDataTypes[t]["pattern"] = data.pattern;
        }

        if(t>=resourceDataTypes.length-1) {
          cb(resourceDataTypes);
          return
        } else {
          t++;
          processDataTypes(t);
        }
      });
    } else {
        if(t>=resourceDataTypes.length-1) {
          cb(resourceDataTypes);
          return
        } else {
          t++;
          processDataTypes(t);
        }
    }
  }
};

var findDataType = exports.findDataType = function(resourceDataTypes,dataTypeId,regex,cb) {
  var temp_result = _.where(resourceDataTypes,{oldId:dataTypeId});

  if(temp_result.length >= 1) {
    if(temp_result[0].dataTypeId == "-1") {
      var dname = temp_result[0].dataTypeName;
      var arrayOrObject = temp_result[0].arrayOrObject;
      var isPattern = 0;
      var pattern = "";

      if(regex != "") {
        isPattern = 1;
      }
      cb({dname:dname,isPattern:isPattern,pattern:regex,arrayOrObject:arrayOrObject});
      return;
    } else {
      var pattern = "";
      if(temp_result[0].dataTypeName == "pattern") {
        pattern = temp_result[0].pattern;
      }
      findDataType(resourceDataTypes,temp_result[0].dataTypeId,pattern,function(typeJSON) {
        cb(typeJSON);
        return;
      })
    }
  } else {
    cb({dname:"",isPattern:0,pattern:"",arrayOrObject:""});
    return
  }
};
