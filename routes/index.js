const express = require('express')

const db = require('../models')
const passport = require('../config/passport')
const restaurantsRouter = require('./restaurants')
const usersRouter = require('./users')
const authHandler = require('../middlewares/auth-handler')

const router = express.Router()
const User = db.User

router.use('/restaurants', authHandler, restaurantsRouter)
router.use('/users', usersRouter)

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/login', (req, res) => {
    if (!req.user?.id) {
        return res.render('login')
    }

    return User.findByPk(
        req.user.id,
        {
            attributes: ['name', 'email'],
            raw: true
        }
    ).then((user) => {
        if (user.name) {
            req.flash('success-msg', `先前是以${user.name}的身分登入，如果要切換身分請先登出`)
            return res.redirect('/restaurants')
        }

        req.flash('success-msg', `先前是以${user.email}的身分登入，如果要切換身分請先登出`)
        return res.redirect('/restaurants')
    })
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