const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')
const record = require('../models/record')

// expense-tracker 首頁
router.get('/', authenticated, (req, res) => {
    record.find({ userId: req.user._id })
        .lean()
        .exec((err, records) => {
            console.log(records)
            let income = true
            let expense = true
            res.render('index', { records, income, expense })
        })
   
})

module.exports = router