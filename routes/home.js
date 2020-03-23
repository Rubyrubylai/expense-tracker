const express = require('express')
const router = express.Router()

// expense-tracker 首頁
router.get('/', (req, res) => {
    res.redirect('/records')
})

module.exports = router