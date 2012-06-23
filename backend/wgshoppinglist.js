var express = require('express');
var passport = require('passport');  
var api = require('./api');
var login = require('./login');
var application = require('./application');
var fs = require('fs');
eval(fs.readFileSync('./config/settings.js', encoding="ascii"));
var mysql      = require('mysql');
var connection = mysql.createConnection({
  	host     : settings.dbhost,
  	user     : settings.dbuser,
  	password : settings.dbpassword,
  	database : settings.database,
});

connection.connect();

login.initLogin(connection,passport);

var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

api.initAPI(app);
application.initApplication(app,passport,connection);
app.listen(8080);

