const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport') 
const bcrypt = require('bcrypt')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login'
    })(req, res, next)
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, password2} = req.body
    User.findOne({ email: email }).then(user => {
        let errors = []
        if (user) {
            errors.push({ message: '此用戶已經存在' })
        } 
        if (password !== password2) {
            errors.push({ message: '兩次密碼輸入不同' })
        }
        if (!name || !email || !password || !password2) {
            errors.push({ message: '所有欄位皆為必填' })
        }
        if (errors.length > 0) {
            res.render('register', {
                name,
                email,
                password,
                password2,
                errors
            })
        }
        else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    const newUser = new User({
                        name: name,
                        email: email,
                        password: hash
                    })
                    newUser
                        .save()
                        .then(user => {
                            res.redirect('/')
                        })
                        .catch(err => console.log(err))  
                })
            })
                          
        }
    })
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', '您已成功登出')
    return res.redirect('/users/login')
})

module.exports = router