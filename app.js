const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/record')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

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
app.use(methodOverride('_method'))

app.use('/records', require('./routes/record'))
app.use('/', require('./routes/home'))

app.listen('3000', () => {
    console.log('app is listening!')
})