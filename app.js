const express = require('express')
const { engine } = require('express-handlebars')
const restaurants = require('./public/jsons/restaurant.json').results
const app = express()
const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  res.render('index', { restaurants })
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find(restaurant => restaurant.id.toString() === id)
  res.render('show', { restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword?.toLowerCase().trim()

  const matchedRestaurants = restaurants.filter(restaurant =>
    Object.keys(restaurant).some(key => {
      if (key === 'name' || key === 'category') {
        return restaurant[key].toLowerCase().includes(keyword)
      }
      return false
    })
  )

  if (!matchedRestaurants.length) {
    res.render('unmatched', { keyword })
    return // 沒有return會報錯: cannot set headers after they are sent to the client
  }

  res.render('index', { restaurants: matchedRestaurants, keyword })
})

app.listen(port, () => {
  console.log(`express sever running on http://localhost:${port}`)
})