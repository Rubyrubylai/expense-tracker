const mongoose = require('mongoose')
const Record = require('../record')
const User = require('../user')
const userSeed = require('./user.json')
const recordSeed = require('./record.json')
const bcrypt = require('bcrypt')
if (process.env.NODE_ENV !== 'production') { 
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI ||' mongodb://localhost/expenseTracker', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', ()=>{
  console.log('db error')
})

db.once('open', ()=>{
  console.log('db connected!')

  userSeed.forEach((user, index) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        User.create({
          name: user.name,
          email: user.email,
          password: hash
        }).then(user => {
          const record = index ? recordSeed.slice(2,5) : recordSeed.slice(0,2)
          record.forEach(record => {
            Record.create({
              name: record.name,
              category: record.category,
              sort: record.sort,
              date: record.date,
              amount: record.amount,
              userId: user._id
            })
          })
        }).catch(err => console.error(err))
      })
    })  
  });

  console.log('done')
})