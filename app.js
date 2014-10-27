var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');
var cons = require('consolidate');
var errorHandler = require('errorhandler');

var routes = require('./routes/index');
var users = require('./routes/users');
var oauthhandling = require('./routes/oauthhandling');
var https = require('https');
var http = require('http');
var app = express();

// oauth stuff

// view engine setup
app.engine('html', cons.handlebars);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
	secret: 'don\'t let him know',
	resave: false
}));

app.use('/', routes);
app.use('/service', oauthhandling);

app.use('/users', users);
app.use(express.static(path.join(__dirname, 'public')));
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

/* 
app.listen = function(port){
  var server = https.createServer({
  	key:fs.readFileSync(path.join(__dirname, 'ssl_keystore/server.key')),
  	cert:fs.readFileSync(path.join(__dirname, 'ssl_keystore/server.crt'))
  }, app);
  
  var httpRedirectApp =  express();
  var server0 = http.createServer(httpRedirectApp).listen(port + 80);
  var mainUrl = 'https://'+ config.thirdPartyHost +':'+ port;
  console.log('You may also access http://%s:%d', config.thirdPartyHost, port + 80);
  httpRedirectApp.get('*', function(req, res){
  		  
  		  console.log('redirect to %s', mainUrl);
  		  res.redirect(mainUrl);
  });
  return server.listen.apply(server, arguments);
};
*/
module.exports = app;
