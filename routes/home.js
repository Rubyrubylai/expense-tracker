const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')
const Record = require('../models/record')
const dateFormat = require('../config/dateFormat')

// expense-tracker 首頁
router.get('/', authenticated, (req, res) => {
    Record.find({ userId: req.user._id })
        .lean()
        .exec((err, records) => {
            dateFormat(records)
            res.render('index', { records })
        })
   
})

module.exports = router