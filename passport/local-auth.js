const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

passport.use('local-signUp', new localStrategy({
    emailField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    
}))