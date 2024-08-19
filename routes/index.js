const express = require('express')
const restaurantsRouter = require('./restaurants')

const router = express.Router()

router.use('/restaurants', restaurantsRouter)

router.get('/', (req, res) => {
    res.redirect('/restaurants')
})

module.exports = router