const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const ExpenseTracker = require('./models/record')

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

app.get('/', (req, res) => {
    res.render('index')
})

// expense-tracker 首頁
app.get('/', (req, res) => {
    res.send('expense-tracker 首頁')
})
// 進入新增花費的頁面
app.get('/records/new', (req, res) => {
    res.send('新增花費頁面')
})
// 新增一筆花費紀錄
app.post('/records', (req, res) => {
    res.send('新增花費')
})
// 瀏覽全部花費
app.get('/records', (req, res) => {
    res.send('瀏覽全部花費')
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