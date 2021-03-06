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
            //日期由大到小排序
            records.sort((a, b) => {
                return a.date - b.date
            })

            //月份          
            let month = []
            for (i=1; i<=12 ; i++) {
                month.push(i)
            }

             //篩選收入
            if (req.query.sort === 'income') {
                records = records.filter(records => {
                    return records.sort === req.query.sort
                })
            }
            else if (req.query.sort === 'expense') {
                records = records.filter(records => {
                    return records.sort === req.query.sort
                })
            }
            //篩選類別
            else if (req.query.category) {
                records = records.filter(records => {
                    return records.category === req.query.category
                })
            }
            //篩選月份
            else if (req.query.month) {
                records = records.filter(records => {
                    return records.date.getMonth() === req.query.month-1
                })
            }
            else {
                //篩選為今天日期
                records = records.filter(record => {
                    return record.date.toLocaleDateString() === new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' })
                })
            }

            let incomeAmount = 0
            let expenseAmount = 0
            records.forEach(record => {
                //總收入
                if (record.sort === 'income') {
                    incomeAmount += record.amount
                }
                //總支出
                if (record.sort === 'expense') {
                    expenseAmount += record.amount
                }
            })

            //總金額
            let totalAmount = incomeAmount - expenseAmount

            dateFormat(records)
            
            res.render('index', { records, month, incomeAmount, expenseAmount, totalAmount })
        })
   
})

module.exports = router