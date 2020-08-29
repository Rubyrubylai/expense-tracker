const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { authenticated } = require('../config/auth')
const dateFormat = require('../config/dateFormat')

// 進入新增花費的頁面
router.get('/new', authenticated, (req, res) => {
    return res.render('new')
})

// 新增一筆花費紀錄
router.post('/', authenticated, (req, res) => {
    const { name, category, date, amount } = req.body 
    let errors = []
    if (!name || !date || !category || !amount){
        errors.push({ message: '所有欄位皆為必填' })
        return res.render('new', { errors: errors, name, category, date, amount })
    } else {
        const record = new Record({
            name,
            category,
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

// 瀏覽全部花費
router.get('/', authenticated, (req, res) => {
    Record.find({ userId: req.user._id })
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
            console.log(record.date)
            if (err) return console.error(err)
            return res.render('edit', { record: record })            
        })
})

// 修改一筆花費紀錄
router.put('/:id/edit', authenticated, (req, res) => {
    Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
        const { name, category, date, amount } = req.body
        let errors = [] 
        record.name = name
        record.category = category
        record.date = date
        record.amount = amount
        if (!name || !category || !date || !amount){
            errors.push({ message: '所有欄位皆為必填' })
            return res.render('edit', { errors: errors, record: { name, category, date, amount } })
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

