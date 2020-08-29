const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { authenticated } = require('../config/auth')
const dateFormat = require('../config/dateFormat')

// 進入新增花費的頁面
router.get('/new', authenticated, (req, res) => {
    let income
    let expense
    if (req.query.sort === 'income') {
        income = true
    }
    if (req.query.sort === 'expense') {
        expense = true
    }
    return res.render('new', { income, expense })
})

// 新增一筆花費紀錄
router.post('/new', authenticated, (req, res) => {
    const { name, category, date, amount, sort } = req.body 
    let errors = []
    if (!name || !date || !category || !amount){
        let income
        let expense 
        if (req.body.sort === 'income') {
            income = true
        }
        if (req.body.sort === 'expense') {
            expense = true
        }
        errors.push({ message: '所有欄位皆為必填' })
        return res.render('new', { errors: errors, name, category, date, amount, income, expense })
    } else {
        const record = new Record({
            name,
            category,
            sort,
            date,
            amount,
            userId: req.user._id
        })
        record.save(err => {
            if (err) return console.error(err)
            let success = []
            success.push({ message: '已成功新增' })  
            const { name, category, date, amount, sort, _id } = record
            //將新增的record顯示於畫面上，不能直接records.push(record)進去
            let records = [
                {
                    name: name,
                    category: category,
                    sort: sort,
                    date: date.toLocaleDateString(),
                    amount: amount,
                    userId: req.user._id,
                    _id: _id
                }
            ]

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

            return res.render('index', { records, success, month, incomeAmount, expenseAmount, totalAmount })
        })
    }   
})

// 進入修改特定花費的頁面
router.get('/:id/edit', authenticated, (req, res) => { 
    Record.findOne({ _id: req.params.id, userId: req.user._id })
        .lean()
        .exec((err, record) => {
            if (err) return console.error(err)
            let income
            let expense
            if (record.sort === 'income') {
                income = true
            }
            if (record.sort === 'expense') {
                expense = true
            }
            record.date = record.date.toISOString().slice(0, 10) 
            return res.render('edit', { record, income, expense })            
        })
})

// 修改一筆花費紀錄
router.put('/:id/edit', authenticated, (req, res) => {
    Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
        //判斷支出或收入，並傳入前端，在錯誤訊息時才能正確顯示編輯收入或支出
        let income
        let expense
        if (record.sort === 'income') {
            income = true
        }
        if (record.sort === 'expense') {
            expense = true
        }
        //將_id傳入前端，重複按鈕送出時，才能知道是哪個/:_id路由
        const _id = req.params.id

        const { name, category, date, amount } = req.body
        let errors = [] 
        record.name = name
        record.category = category
        record.date = date
        record.amount = amount

        if (!name || !category || !date || !amount){
            errors.push({ message: '所有欄位皆為必填' })
            return res.render('edit', { errors, record: { name, category, date, amount, _id }, income, expense })
        } else {
            record.save(err => {
                if (err) return console.error(err)
                req.flash('success_msg', `${record.date.toLocaleDateString()}${record.name} 成功編輯`)
                return res.redirect('/')          
            })  
        }             
    })

})

// 刪除一筆花費紀錄
router.delete('/:id/delete', authenticated, (req, res) => {
    Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
        if (err) return console.error(err)
        record.remove(err => {
            if (err) return console.error(err)
            req.flash('warning_msg', `${record.date.toLocaleDateString()}${record.name} 成功刪除`)
            return res.redirect('/')
        })
    })
})

module.exports = router

