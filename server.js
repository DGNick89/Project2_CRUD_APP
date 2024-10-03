require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const pg = require('pg')
const app = express()
const port = 8088
const methodOverride = require('method-override')
const session = require('express-session');
const bcrypt = require('bcrypt')
const db = require('./DB')
const setCurrentUser = require('./middleware/set_current_user')
const ensureLoggedIn = require('./middleware/ensure_logged_in')
const sessionRouter = require('./routes/session_router')
const profileRouter = require('./routes/profile_router')
const gamesRouter = require('./routes/games_router')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(expressLayouts)

app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24},
    resave: false,
    saveUninitialized: true
}));

app.use(setCurrentUser)

app.get('/', (req, res) => {
    
    const userSql = `
    SELECT games.*, 
    users.name, users.profile_pic FROM games 
    JOIN users on 
    games.user_id = users.id;
    `
    db.query(userSql, (err, result) => {
        if (err) {
            console.log(err);
            
        }
        
        let games = result.rows
        res.render('home', {games})
    })
    
})

app.get('/about', (req, res) => {
    res.render('about')
})


app.use(sessionRouter)
app.use(ensureLoggedIn)

app.use(profileRouter)
app.use(gamesRouter)







app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`)
  })