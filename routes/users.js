const express = require('express')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User
const router = express.Router()

router.post('/', (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body

    if (!email || !password) {
        req.flash('err-msg', '電子郵件與密碼是必填')
        return res.redirect('/register')
    }

    if (password !== confirmPassword) {
        req.flash('err-msg', '密碼與確認密碼不符')
        return res.redirect('/register')
    }

    return User.findOne({
        where: { email },
        raw: true
    }).then((user) => {
        if (user) {
            req.flash('err-msg', '帳號已經存在，可以前往登入頁面登入')
            return res.redirect('/register')
        }

        return bcrypt.hash(password, 10)
    }).then((hash) => {
        return User.create({
            name,
            email,
            password: hash
        })
    }).then((user) => {
        req.flash('success-msg', '註冊成功')
        return res.redirect('/login')
    }).catch((err) => {
        console.error(err)
        err.err_msg = '註冊失敗'
        next(err)
    })
})

module.exports = router