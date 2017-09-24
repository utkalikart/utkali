/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = 'development';// production


var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  }
);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

//--------------------------
var express = require('express');
var session = require('express-session');
var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
//var expressSession = require('express-session');
//var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cookieParser());
//app.use(session({resave: false, saveUninitialized: false, secret: 'SOMERANDOMSECRETHERE', cookie: { sameSite:false ,maxAge: 60000 }}));

//--------------------------

// Setup server
var server = require('http').createServer(app);
// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

/**
 * added socket object in every request before pass to route
 */

app.use((req, res, next) => {
  req.io = io;
next();
})

require('./config/express')(app);
require('./routes')(app);

// Expose app
exports = module.exports = app;

var socketHandler = require("./socket/socket")(io);
