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
            return res.redirect('/')
        })
    }   
})

//篩選類別
router.get('/category', authenticated, (req, res) => {
    Record.find({ category: req.query.category, userId: req.user._id })
        .lean()
        .exec((err, records) => {
            let amount = 0
            for (let record of records) {              
                amount += record.amount                
            }
            dateFormat(records)
            if (err) return console.error(err)
            return res.render('index', { records: records, amount: amount })
        })
})

//篩選月份
router.get('/month', authenticated, (req, res) => {
    Record.find({ userId: req.user._id })
        .lean()
        .exec((err, records) => {        
            var records = records.filter(record => {
                return record.date.getMonth() === req.query.month-1     
            })
            let amount = 0
            for (let record of records) {              
                amount += record.amount                
            }
            dateFormat(records)
            if (err) return console.error(err)
                return res.render('index', { records: records, amount: amount })           
        })
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
            return res.redirect('/')
        })
    })
})

module.exports = router

