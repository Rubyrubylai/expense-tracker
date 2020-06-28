module.exports = records => {
    records.forEach(record => {
    let Y = record.date.getFullYear()
    let M = record.date.getMonth()+1
    let D = record.date.getDate()
    return record.date = Y+'-'+M+'-'+D
    })      
}