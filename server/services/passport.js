const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    });
});

//Creates new instance of Google Strategy
//passport.use I want you to be aware there is a new strat. available
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(new User);
        User.findOne({ googleId: profile.id }).then(existingUser => {
              if (existingUser) {
              // we already have a record with the given profile Id
              done(null, existingUser);

            } else {
              // We don't have a user record with this ID
              new User({ googleId: profile.id }).save()
                .then(user => done(null, user));

        };
      });
    }
  )
);