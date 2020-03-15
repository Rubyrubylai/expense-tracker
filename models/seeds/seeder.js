const mongoose = require('mongoose')
const expenseTracker = require('../record')

mongoose.connect('mongodb://localhost/expenseTracker', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection

db.on('error', ()=>{
  console.log('db error')
})

db.once('open', ()=>{
  console.log('db connected!')

  for(var i=0; i<10; i++){
    expenseTracker.create({name:'name-'+i})
  }
  console.log('done')
})