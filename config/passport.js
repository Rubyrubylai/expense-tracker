const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

module.exports = passport => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email: email }).then(user => {
            if (!user) { return done(null, false, {message: 'That email is not registered' })}
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(isMatch){
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Email or Password incorrect' })
                }                                 
            })

        })
    }))
    passport.use(new FacebookStrategy({
        clientID: '2624744147774042',
        clientSecret: '126a2c77d8bfbdb75491c9868b839e19',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['email', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ email: profile._json.email}).then(user => {
            console.log(profile)
            if (!user) {
                var randomPassword = Math.random().toString(36).slice(-8)
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(randomPassword, salt, (err, hash) => {
                        const newUser = User({
                            email: profile._json.email,
                            name: profile._json.name,
                            password: hash
                        })
                        newUser.save().then(user => {
                            return done(null, user)
                        }).catch(err => {
                            console.log(err)
                        })
                    })
                })
            } else {
                return done(null, user)
            }
        })
    }
    ))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
       
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .exec((err, user) => {
                done(err, user)
            }) 
    })
}


