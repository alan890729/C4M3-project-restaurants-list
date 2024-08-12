const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const { Op } = require('sequelize')
const db = require('./models')
const Restaurant = db.Restaurant
const app = express()
const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
    return Restaurant.findAll({
        raw: true
    }).then((restaurants) => {
        res.render('restaurants', { restaurants })
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.get('/restaurants/new', (req, res) => {
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
        res.render('new-restaurant', { categories: restaurantCategories })
    })
})

app.post('/restaurants', (req, res) => {
    const body = req.body
    body.rating = Number(body.rating)

    return Restaurant.create(body).then((results) => {
        res.redirect('/restaurants')
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id

    return Restaurant.findByPk(
        Number(id),
        {
            raw: true
        }
    ).then((restaurant) => {
        res.render('detail', { restaurant })
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.get('/restaurants/:id/edit', (req, res) => {
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
        res.render('restaurant-edit', { restaurant, categories: restaurantCategories })
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.put('/restaurants/:id', (req, res) => {
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
        res.redirect(`/restaurants/${id}`)
    }).catch((err) => {
        res.status(422).json(err)
    })
    
})

// 做一個delete confirm頁面
app.get('/restaurants/:id/delete-confirm', (req, res) => {
    const id = req.params.id

    return Restaurant.findByPk(Number(id), {
        raw: true
    }).then((restaurant) => {
        const { id, name } = restaurant
        res.render('delete-confirm', { id, name })
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.delete('/restaurants/:id', (req, res) => {
    const id = req.params.id

    return Restaurant.destroy({
        where: {
            id: Number(id)
        }
    }).then((results) => {
        res.redirect('/restaurants')
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.get('/search', (req, res) => {
    const keyword = req.query.keyword?.trim()

    Restaurant.findAll(
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
            res.render('unmatched', { keyword })
        } else {
            res.render('restaurants', { restaurants: data, keyword })
        }
    }).catch((err) => {
        res.status(422).json(err)
    })
})

app.listen(port, () => {
    console.log(`express sever running on http://localhost:${port}`)
})