const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

const router = require('./routes')
const flashMessageHandler = require('./middlewares/flash-message-handler')
const errorHandler = require('./middlewares/error-handler')

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

const app = express()
const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(flashMessageHandler)

app.use(router)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`express sever running on http://localhost:${port}`)
})