const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const restaurants = require('./public/jsons/restaurant.json').results
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
    res.render('restaurants', { restaurants })
})

app.get('/restaurants/new', (req, res) => {
    const restaurantCategories = []
    
    restaurants.forEach(restaurant => {
        if (!restaurantCategories.some(category => category === restaurant.category)) {
            restaurantCategories.push(restaurant.category)
        }
    })
    console.log(restaurantCategories)
    res.render('new-restaurant', { categories: restaurantCategories })
})

app.post('/restaurants', (req, res) => {
    res.send('processing incoming data, will soon create new restaurant data in database')
})

app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id
    const restaurant = restaurants.find(restaurant => restaurant.id.toString() === id)
    res.render('detail', { restaurant })
})

app.get('/restaurants/:id/edit', (req, res) => {
    const id = req.params.id
    const restaurant = restaurants.find(restaurant => restaurant.id.toString() === id)
    const restaurantCategories = []

    restaurants.forEach(restaurant => {
        if (!restaurantCategories.some(category => category === restaurant.category)) {
            restaurantCategories.push(restaurant.category)
        }
    })
    console.log(restaurantCategories)
    res.render('restaurant-edit', { restaurant, categories: restaurantCategories })
})

app.put('/restaurants/:id', (req, res) => {
    const id = req.params.id
    const body = req.body
    res.send(`update restaurant: ${id}`)
})

app.get('/search', (req, res) => {
    const keyword = req.query.keyword?.trim()

    const matchedRestaurants = restaurants.filter(restaurant =>
        Object.keys(restaurant).some(key => {
            if (key === 'name' || key === 'category') {
                return restaurant[key].toLowerCase().includes(keyword.toLowerCase())
            }
            return false
        })
    )

    if (!matchedRestaurants.length) {
        res.render('unmatched', { keyword })
        return
    }

    res.render('restaurants', { restaurants: matchedRestaurants, keyword })
})

app.listen(port, () => {
    console.log(`express sever running on http://localhost:${port}`)
})