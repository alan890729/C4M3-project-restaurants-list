module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    req.flash('err-msg', '登入後即可繼續先前操作')
    return res.redirect('/login')
}