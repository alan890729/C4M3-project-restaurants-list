const express = require('express')

const passport = require('../config/passport')
const restaurantsRouter = require('./restaurants')
const usersRouter = require('./users')
const authHandler = require('../middlewares/auth-handler')

const router = express.Router()

router.use('/restaurants', authHandler, restaurantsRouter)
router.use('/users', usersRouter)

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/restaurants',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login/facebook', passport.authenticate('facebook', {
    scope: ['email']
}))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
    successRedirect: '/restaurants',
    failureRedirect: '/login',
    failureFlash: true
}))

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            err.err_msg = '登出失敗'
            return next(err)
        }

        req.flash('success-msg', '登出成功')
        return res.redirect('/login')
    })
})

module.exports = router