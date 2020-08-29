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
            //篩選類別
            if (req.query.category) {
                records = records.filter(records => {
                    return records.category === req.query.category
                })
            }

            //篩選月份
            let month = []
            for (i=1; i<=12 ; i++) {
                month.push(i)
            }
            if (req.query.month) {
                records = records.filter(records => {
                    return records.date.getMonth() === req.query.month-1
                })
            }
            
            dateFormat(records)
            res.render('index', { records, month })
        })
   
})

module.exports = router