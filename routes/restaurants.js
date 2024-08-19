const express = require('express')
const db = require('../models')
const { Op } = require('sequelize')

const router = express.Router()
const Restaurant = db.Restaurant

router.get('/', (req, res) => {
    return Restaurant.findAll({
        raw: true
    }).then((restaurants) => {
        return res.render('restaurants', { restaurants })
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

router.get('/new', (req, res) => {
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
    })
})

router.post('/', (req, res) => {
    const body = req.body
    body.rating = Number(body.rating)

    return Restaurant.create(body).then((results) => {
        req.flash('success-msg', '新增成功')
        return res.redirect('/restaurants')
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

router.get('/search', (req, res) => {
    console.log('on route: /restaurants/search')
    const keyword = req.query.keyword?.trim()

    return Restaurant.findAll(
        {
            where: {
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
        } else {
            return res.render('restaurants', { restaurants: data, keyword })
        }
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id

    return Restaurant.findByPk(
        Number(id),
        {
            raw: true
        }
    ).then((restaurant) => {
        return res.render('detail', { restaurant })
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

router.get('/:id/edit', (req, res) => {
    const id = req.params.id

    return Promise.all(
        [
            Restaurant.findByPk(
                Number(id),
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
        const restaurantCategories = []
        rawCategories.forEach(element => {
            if (!restaurantCategories.some(category => element.category === category)) {
                restaurantCategories.push(element.category)
            }
        })
        return res.render('restaurant-edit', { restaurant, categories: restaurantCategories })
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

router.put('/:id', (req, res) => {
    const id = req.params.id
    const body = req.body
    body.rating = Number(body.rating)

    return Restaurant.update(
        body,
        {
            where: {
                id: Number(id)
            }
        }
    ).then((results) => {
        req.flash('success-msg', '編輯成功')
        return res.redirect(`/restaurants/${id}`)
    }).catch((err) => {
        return res.status(422).json(err)
    })

})

// 做一個delete confirm頁面
router.get('/:id/delete-confirm', (req, res) => {
    const id = req.params.id

    return Restaurant.findByPk(Number(id), {
        raw: true
    }).then((restaurant) => {
        const { id, name } = restaurant
        return res.render('delete-confirm', { id, name })
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    const deleteRestaurantName = req.body.delete_restaurant_name

    return Restaurant.destroy({
        where: {
            id: Number(id)
        }
    }).then((results) => {
        req.flash('success-msg', '成功刪除')
        req.flash('delete-restaurant-name', deleteRestaurantName)
        return res.redirect('/restaurants')
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

module.exports = router