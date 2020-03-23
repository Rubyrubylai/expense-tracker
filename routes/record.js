const express = require('express')
const router = express.Router()
const Record = require('../models/record')

// 進入新增花費的頁面
router.get('/new', (req, res) => {
    return res.render('new')
})
// 新增一筆花費紀錄
router.post('/', (req, res) => {
    const record = new Record({
        name: req.body.name,
        category: req.body.category,
        date: req.body.date,
        amount: req.body.amount
    })
    record.save(err => {
        if (err) return console.error(err)
        return res.redirect('/')
    })
})
// 瀏覽全部花費
router.get('/', (req, res) => {
    Record.find()
        .lean()
        .exec((err, records) => {
            if (err) return console.error(err)
            return res.render('index', {records: records})
        })
})
// 瀏覽特定花費詳情
router.get('/:id', (req, res) => {
    res.send('瀏覽特定花費詳情')
})
// 進入修改特定花費的頁面
router.get('/:id/edit', (req, res) => { 
    Record.findById(req.params.id)
        .lean()
        .exec((err, record) => {
            if (err) return console.error(err)
            return res.render('edit', {record: record})            
        })
})
// 修改一筆花費紀錄
router.put('/:id/edit', (req, res) => {
    Record.findById(req.params.id, (err, record) => {
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
router.delete('/:id/delete', (req, res) => {
    Record.findById(req.params.id, (err, record) => {
        if (err) return console.error(err)
        record.remove(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
    })
})

module.exports = router

