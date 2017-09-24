'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/scaffold-dev'
    //uri: 'mongodb://scaffold-dev:fhir4321!@138.68.56.250:27017/scaffold-dev'
  },
  BaseUrl : "http://138.68.56.250:9000",
  //BaseUrl : "http://localhost:9000",

  seedDB: true
};
