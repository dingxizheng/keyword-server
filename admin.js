module.exports = function(passport, LocalStrategy, app) {

    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {

            if (username === 'admin' && password === 'root') {
                done(null, {
                    name: 'admin',
                    password: 'root',
                    id: '12345678'
                });
            } else if (username === 'admin') {
                done(null, false, {
                    message: "Wrong password"
                });
            } else {
                done(null, false, {
                    message: "The user does not exist"
                });
            }

        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {

        if (id === '12345678')
            done(null, {
                name: 'admin',
                password: 'root',
                id: '12345678'
            });
        else
            done(new Error('User ' + id + ' does not exist'));

    });

    app.get('/admin/logedin', function(req, res, next) {
        if (req.isAuthenticated()) {
            res.send({
                logedin: 1,
                message: 'Login successfully',
                user: req.user
            });
        } else {
            var err = new Error();
            err.status = 401;
            err.message = 'You are not authorized. Please login.';
            next(err);
            // res.send('error/401', { logedin: 0, message: 'You are not authorized. Please login.' });
        }

    });

    app.post('/admin/login', function(req, res, next) {

        // ask passport to authenticate
        passport.authenticate('local', function(err, user, info) {

            if (err) {
                // if error happens
                return next(err);
            }

            if (!user) {
                // if authentication fail, get the error message that we set
                var msg = {
                    logedin: 0,
                    message: info.message
                };
                return res.send(msg);
            }

            // if everything's OK
            req.logIn(user, function(err) {
                console.log(err);
                if (err) {
                    return next(err);
                }
                var msg = {
                    logedin: 1,
                    message: 'Logedin successfully',
                    user: user
                };
                return res.send(msg);
            });

        })(req, res, next);

    });

    app.get('/admin/logout', function(req, res, next) {
        if (req.isAuthenticated()) {
            req.logout();
        }
        var err = new Error('You are not authorized. Please login.');
        err.status = 401;
        next(err);
    });

}
