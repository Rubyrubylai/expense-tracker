const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/record')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/expenseTracker', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection

db.on('error', ()=>{
    console.log('mongodb error!')
})

db.once('open', ()=>{
    console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({extended: true}))


// expense-tracker 首頁
app.get('/', (req, res) => {
    res.redirect('/records')
})
// 進入新增花費的頁面
app.get('/records/new', (req, res) => {
    return res.render('new')
})
// 新增一筆花費紀錄
app.post('/records', (req, res) => {
    const record = new Record({
        name: req.body.name,
        category: req.body.category,
        date: req.body.date,
        amount: req.body.amount
    })
    record.save(err => {
        if (err) return console.error(err)
        return res.redirect('/records')
    })
})
// 瀏覽全部花費
app.get('/records', (req, res) => {
    Record.find()
        .lean()
        .exec((err, records) => {
            if (err) return console.error(err)
            return res.render('index', {records: records})
        })
})
// 瀏覽特定花費詳情
app.get('/records/:id', (req, res) => {
    res.send('瀏覽特定花費詳情')
})
// 進入修改特定花費的頁面
app.get('/records/:id/edit', (req, res) => {
    res.send('修改特定花費的頁面')
})
// 修改一筆花費紀錄
app.put('/records/:id', (req, res) => {
    res.send('修改花費')
})
// 刪除一筆花費紀錄
app.delete('/records/:id', (req, res) => {
    res.send('刪除花費')
})

app.listen('3000', () => {
    console.log('app is listening!')
})