const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/record')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const Handlebars = require('handlebars')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') { 
    require('dotenv').config()
}

mongoose.connect('mongodb://localhost/expenseTracker', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', ()=>{
    console.log('mongodb error!')
})

db.once('open', ()=>{
    console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use(flash())

Handlebars.registerHelper('ifEquals', (a, b, options) => {
    if (a==b) {
        return options.fn(this)
    }
    else {
        return options.inverse(this)
    }
})

app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.warning_msg = req.flash('warning_msg')
    res.locals.success_msg = req.flash('success_msg')
    next()
})

app.use('/', require('./routes/home'))
app.use('/records', require('./routes/record'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auth'))

app.listen('3000', () => {
    console.log('app is listening!')
})