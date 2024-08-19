module.exports = (req, res, next) => {
    res.locals.success_msg = req.flash('success-msg')
    res.locals.delete_restaurant_name = req.flash('delete-restaurant-name')

    next()
}