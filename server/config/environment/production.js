'use strict';

// Production specific configuration
// =================================
module.exports = {
  // MongoDB connection options
  mongo: {
    //uri      : 'mongodb://iFHIR:iFHIR4321@localhost:27017/iFHIR'
    uri: 'mongodb://localhost/scaffold-dev'
  },
  BaseUrl    : "http://ifhir.com",
  BaseUrlCom : "http://www.ifhir.com",
  mysql: {
    host     : 'www.ifhir.com',
    user     : 'root',
    password : 'Admin11#admin11#',
    database : 'clinical_architecture'
  },
  HapifhirUrl : 'http://www.ifhir.com:8080/hapifhir',
  seedDB: true
};
