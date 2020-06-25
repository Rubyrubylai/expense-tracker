const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { authenticated } = require('../config/auth')

// 進入新增花費的頁面
router.get('/new', authenticated, (req, res) => {
    return res.render('new')
})
// 新增一筆花費紀錄
router.post('/', authenticated, (req, res) => {
    const record = new Record({
        name: req.body.name,
        category: req.body.category,
        date: req.body.date,
        amount: req.body.amount,
        userId: req.user._id
    })
    record.save(err => {
        if (err) return console.error(err)
        return res.redirect('/')
    })
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
            if (err) return console.error(err)
            return res.render('index', { records: records, amount: amount })
        })
})
// 瀏覽特定花費詳情
router.get('/:id', authenticated, (req, res) => {
    res.send('瀏覽特定花費詳情')
})
// 進入修改特定花費的頁面
router.get('/:id/edit', authenticated, (req, res) => { 
    Record.findOne({ _id: req.params.id, userId: req.user._id })
        .lean()
        .exec((err, record) => {
            if (err) return console.error(err)
            return res.render('edit', { record: record })            
        })
})
// 修改一筆花費紀錄
router.put('/:id/edit', authenticated, (req, res) => {
    Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
        if (err) return console.error(err)
        record.name = req.body.name
        record.category = req.body.category
        record.date = req.body.date
        record.amount = req.body.amount
        record.save(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
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

