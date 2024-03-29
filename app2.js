#!/usr/bin/env node
var debug = require('debug')('my-application');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('swig');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');



// get the app
var app = express();

// set view engine
app.engine('html', engine.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(session({secret: 'keyboard cat'}));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session())
app.use('/phonegap', express.static('/Users/mover/documents/projects/testApp/www'));

// load controllers  
var customers = require('./controllers/customers');
var keywords  = require('./controllers/keywords');

// load routes
app.use('/customers', customers);
app.use('/keywords', keywords);

app.get('/admin', function(req, res, next){  
    res.redirect('./phonegap/index.html');
});

app.get('/', function(req, res){
    res.send("you are connecte");
});

// set up admin authentication
var admin = require('./admin');
admin(passport, LocalStrategy, app);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: "Opps!!"
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: "Opps!"
    });
});

// start the server
app.set('port', process.env.PORT || 3006);
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});


