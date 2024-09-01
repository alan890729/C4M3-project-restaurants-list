const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')

const db = require('../models')

const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    return User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
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

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['displayName', 'email']
}, (accessToken, refreshToken, profile, done) => {
    const name = profile.displayName
    const email = profile.emails[0].value

    return User.findOne({
        attributes: ['id', 'name', 'email'],
        where: { email },
        raw: true
    }).then((user) => {
        if (user) {
            return done(null, user)
        }

        const password = Math.random().toString(36).slice(-8)
        return bcrypt.hash(password, 10).then((hash) => {
            return User.create({
                name,
                email,
                password: hash
            })
        }).then((user) => {
            return done(null, {
                id: user.id,
                name: user.name,
                email: user.email
            })
        })
    }).catch((err) => {
        err.err_msg = '登入失敗'
        return done(err)
    })
}))

passport.serializeUser((user, done) => {
    const { id, name, email } = user
    return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
    return done(null, { id: user.id })
})

module.exports = passport