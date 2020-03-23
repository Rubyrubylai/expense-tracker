const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    res.send('登入')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    res.send('註冊')
})

router.get('/logout', (req, res) => {
    res.send('登出頁面')
})

module.exports = router