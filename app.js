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
var multer = require('multer');



// get the app
var app = express();

// set view engine
app.engine('html', engine.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(session({
    secret: 'keyboard cat'
}));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({
    dest: './uploads/'
}));
app.use('/admin', express.static(path.join(__dirname, 'admin/ATE')));

// inject login checking function to every req object
// this function can be called anywhere after this
app.use(function(req, res, next) {
    req.checkLogin = function() {
        if (!req.isAuthenticated()) {
            var err = new Error();
            err.status = 401;
            err.message = 'You are not authorized. Please login.';
            next(err);        
        }
    };
    next();
});

// load controllers  
var customers = require('./controllers/customers');
var keywords = require('./controllers/keywords');
var fileuploader = require('./controllers/fileuploader');

// load routes
app.use('/customers', customers);
app.use('/keywords', keywords);
app.use('/images', fileuploader);

app.get('/admin', function(req, res, next) {
    res.redirect('./admin/ATE/index.html');
});
app.get('/', function(req, res) {
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
        res.send({
            message: err.message,
            error: err,
            title: "Opps!!"
        });
    });
}

// production error handler
// no stacktraces leaked to user
// if (app.get('env') === 'production') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: {},
//             title: "Opps!"
//         });
//     });
// }

// start the server
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});
