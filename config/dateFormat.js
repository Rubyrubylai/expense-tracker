module.exports = records => {
    records.forEach(record => {
        //record.date = record.date.toISOString().slice(0, 10) 套用格式
        let Y = record.date.getFullYear()
        let M = record.date.getMonth()+1
        let D = record.date.getDate()
        return record.date = Y+'-'+M+'-'+D
    })      
}