const express = require('express')

const db = require('../models')
const { getOrderCondition, sortButtonActiveSwitcher } = require('../scripts/sort-restaurants')

const router = express.Router()
const Restaurant = db.Restaurant
const { Op } = require('sequelize')

router.get('/', (req, res, next) => {
    const incomingSortStatus = req.query.sortStatus || 'none'
    const userId = req.user.id

    sortButtonActiveSwitcher(res, incomingSortStatus)

    return Restaurant.findAll({
        where: { userId },
        order: getOrderCondition(incomingSortStatus),
        raw: true
    }).then((restaurants) => {
        return res.render('restaurants', { restaurants })
    }).catch((err) => {
        err.err_msg = '資料取得失敗'
        next(err)
    })
})

router.get('/new', (req, res, next) => {
    const restaurantCategories = []

    return Restaurant.findAll(
        {
            attributes: ['category'],
            raw: true
        }
    ).then((data) => {
        data.forEach(element => {
            if (!restaurantCategories.some(category => element.category === category)) {
                restaurantCategories.push(element.category)
            }
        })
        return res.render('new-restaurant', { categories: restaurantCategories })
    }).catch((err) => {
        err.err_msg = '取得新增餐廳頁面失敗'
        next(err)
    })
})

router.post('/', (req, res, next) => {
    const body = req.body
    body.rating = Number(body.rating)
    body.userId = req.user.id

    return Restaurant.create(body).then((results) => {
        req.flash('success-msg', '新增成功')
        return res.redirect('/restaurants')
    }).catch((err) => {
        err.err_msg = '新增餐廳失敗'
        next(err)
    })
})

router.get('/search', (req, res, next) => {
    const keyword = req.query.keyword?.trim()
    const userId = req.user.id

    return Restaurant.findAll(
        {
            where: {
                userId,
                [Op.or]: {
                    name: {
                        [Op.like]: `%${keyword}%`
                    },
                    category: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            },
            raw: true
        }
    ).then((data) => {
        if (!data.length) {
            return res.render('unmatched', { keyword })
        }

        return res.render('restaurants-search', { restaurants: data, keyword })
    }).catch((err) => {
        next(err)
    })
})

router.get('/:id', (req, res, next) => {
    const restaurantId = req.params.id
    const userId = req.user.id

    return Restaurant.findByPk(
        Number(restaurantId),
        {
            raw: true
        }
    ).then((restaurant) => {
        if (!restaurant || userId !== restaurant.userId) {
            req.flash('err-msg', '找不到資料') // 我認為'找不到資料'透露的訊息比'沒有權限'少，所以在使用者id不符合時我也用'找不到資料'
            return res.redirect('/restaurants')
        }

        return res.render('detail', { restaurant })
    }).catch((err) => {
        err.err_msg = '取得餐廳細部資料失敗'
        next(err)
    })
})

router.get('/:id/edit', (req, res, next) => {
    const restaurantId = req.params.id
    const userId = req.user.id

    return Promise.all(
        [
            Restaurant.findByPk(
                Number(restaurantId),
                {
                    raw: true
                }
            ),
            Restaurant.findAll(
                {
                    attributes: ['category'],
                    where: {
                        category: {
                            [Op.not]: ''
                        }
                    },
                    raw: true
                }
            )
        ]
    ).then((data) => {
        const [restaurant, rawCategories] = data

        if (!restaurant || userId !== restaurant.userId) {
            req.flash('err-msg', '找不到資料')
            return res.redirect('/restaurants')
        }

        const restaurantCategories = []
        rawCategories.forEach(element => {
            if (!restaurantCategories.some(category => element.category === category)) {
                restaurantCategories.push(element.category)
            }
        })
        return res.render('restaurant-edit', { restaurant, categories: restaurantCategories })
    }).catch((err) => {
        next(err)
    })
})

router.put('/:id', (req, res, next) => {
    const restaurantId = req.params.id
    const body = req.body
    const userId = req.user.id
    body.rating = Number(body.rating)

    return Restaurant.findByPk(Number(restaurantId)).then((restaurant) => {
        if (!restaurant || userId !== restaurant.userId) {
            req.flash('err-msg', '找不到欲修改的資料')
            return res.redirect('/restaurants')
        }

        return restaurant.update(body)
    }).then(() => {
        req.flash('success-msg', '編輯成功')
        return res.redirect(`/restaurants/${restaurantId}`)
    }).catch((err) => {
        err.err_msg = '編輯餐廳資料失敗'
        next(err)
    })
})

// 做一個delete confirm頁面
router.get('/:id/delete-confirm', (req, res, next) => {
    const restaurantId = req.params.id
    const userId = req.user.id

    return Restaurant.findByPk(Number(restaurantId)).then((restaurant) => {
        if (!restaurant || userId !== restaurant.userId) {
            req.flash('err-msg', '找不到欲刪除的資料')
            return res.redirect('/restaurants')
        }

        const { id, name } = restaurant
        return res.render('delete-confirm', { id, name })
    }).catch((err) => {
        err.err_msg = '取得確認刪除頁失敗'
        next(err)
    })
})

router.delete('/:id', (req, res, next) => {
    const restaurantId = req.params.id
    const deleteRestaurantName = req.body.delete_restaurant_name
    const userId = req.user.id

    return Restaurant.findByPk(Number(restaurantId)).then((restaurant) => {
        if (!restaurant || userId !== restaurant.userId) {
            req.flash('err-msg', '找不到欲刪除的資料')
            return res.redirect('/restaurants')
        }

        return restaurant.destroy()
    }).then(() => {
        req.flash('success-msg', '成功刪除')
        req.flash('delete-restaurant-name', deleteRestaurantName)
        return res.redirect('/restaurants')
    }).catch((err) => {
        err.err_msg = '刪除餐廳失敗'
        next(err)
    })
})

module.exports = router