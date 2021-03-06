const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

module.exports = passport => {
    passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {      
        User.findOne({ email: email }).then(user => { 
            if (!user) { 
                return done(null, false, req.flash('warning_msg', '此用戶不存在'))
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(isMatch){
                    return done(null, user)
                } else {
                    return done(null, false, req.flash('warning_msg', '密碼輸入錯誤'))
                }                                 
            })

        })
    }))
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ email: profile._json.email}).then(user => {
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


