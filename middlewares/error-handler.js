module.exports = (err, req, res, next) => {
    console.error(err)
    req.flash('err-msg', err.err_msg || '處理失敗')
    res.redirect('back')

    next(err)
}