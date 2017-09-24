var config = require('../config/environment');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

ObjectID = module.exports = mongo.ObjectID;

MongoClient.connect(config.mongo.uri, function(err, database) {
	  if (err) throw err;
	   
    db = module.exports = database;
})

