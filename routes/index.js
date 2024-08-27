const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const restaurantsRouter = require('./restaurants')
const usersRouter = require('./users')
const db = require('../models')
const authHandler = require('../middlewares/auth-handler')

const router = express.Router()
const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    return User.findOne({
        attributes: ['id', 'email', 'password'],
        where: {
            email: username
        },
        raw: true
    }).then((user) => {
        if (!user) {
            return done(null, false, { type: 'err-msg', message: '電子郵件或密碼錯誤' })
        }

        return bcrypt.compare(password, user.password).then((isMatched) => {
            if (!isMatched) {
                return done(null, false, { type: 'err-msg', message: '電子郵件或密碼錯誤' })
            }

            return done(null, user)
        })
    }).catch((err) => {
        err.err_msg = '登入失敗'
        return done(err)
    })
}))

passport.serializeUser((user, done) => {
    return done(null, user)
})

passport.deserializeUser((user, done) => {
    return done(null, { id: user.id })
})

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