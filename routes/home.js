const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')

// expense-tracker 首頁
router.get('/', authenticated, (req, res) => {
    res.redirect('/records')
})

module.exports = router