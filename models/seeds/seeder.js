const mongoose = require('mongoose')
const Record = require('../record')

mongoose.connect('mongodb://localhost/expenseTracker', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection

db.on('error', ()=>{
  console.log('db error')
})

db.once('open', ()=>{
  console.log('db connected!')

  for(var i=0; i<10; i++){
    Record.create(
      {name:'name-'+i, 
      category:'category-'+i,
      date: '2019/1/1',
      amount: i}
    )
  }
  console.log('done')
})