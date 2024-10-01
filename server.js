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

app.get('/', (req, res) => {
  res.render('home')  
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login' ,(req, res) => {
    const email = req.body.email
    const password = req.body.password
    let sql = `
    SELECT *
    FROM users
    WHERE email = $1;
    `
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.log(err)            
        }
        if (result.rows.length === 0)
            return res.send('User not found')
        const user = result.rows[0]
        bcrypt.compare(password, user.password_digest, (err, isCorrect) => {
            if (err) {
                console.log(err)                
            }
            if (!isCorrect) {
                console.log('password is wrong')
                return res.send('password is wrong')                
            }
            req.session.userId = user.id
            res.redirect('/')
        })    
        
    })
})



app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`)
  })