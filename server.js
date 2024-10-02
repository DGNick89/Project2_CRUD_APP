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
const { user } = require('pg/lib/defaults')

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
        console.log(games)
        res.render('home', {games})
    })
    
})
    


app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.post('/signup', (req, res) => {
    
    let name = req.body.name
    let email = req.body.email
    let plainTextPassword = req.body.password
    let profilePic = req.body.profile_pic
    
    let saltRounds = 10

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(plainTextPassword, salt, (err, hash) => {
            const sql = `INSERT INTO users
            (name, email, password_digest, profile_pic)
            VALUES
            ($1, $2, $3, $4)
            RETURNING *;
            `
            db.query(sql, [name, email, hash, profilePic], (err, result) => {
                if (err) {
                    console.log(err);
                }
                
                const user = result.rows[0]
                console.log(user);
                res.render('/')
            })
        })
    })
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

app.use(ensureLoggedIn)

app.get('/new', (req, res) => {
    res.render('new')
})

app.post('/new', (req, res) => {
    
    let sport = req.body.sports
    let location = req.body.location
    let time = req.body.time
    let userId = req.session.userId
    const sql =`
    INSERT INTO games
    (sport, location, time, user_id)
    VALUES
    ($1, $2, $3, $4)
    `
    db.query(sql, [sport, location, time, userId], (err, result) => {
        if (err) {
            console.log(err)            
        }
        let games = result.rows
        console.log(games);
        res.render('/', {games})
    })
}) 

app.get('/game/:id', (req, res) => {
    const userSql = `
    SELECT games.*, 
    users.name, users.profile_pic FROM games 
    JOIN users on 
    games.user_id = users.id
    WHERE games.id = $1
    `
        db.query(userSql, [req.params.id], (err, result) => {
            if (err) {
                console.log(err)                
            }
            let game = result.rows[0]
            res.render('index', {game})
        })
    
})

app.post('/game/:id', (req, res) => {
    let sql = `
    SELECT name, profile_pic
    FROM users
    WHERE id = $1`
    db.query(sql, [req.session.userId], (err, result) => {
        if (err) {
            console.log(err)            
        }
        let user = result.rows[0]
        console.log(user)
        res.render('index', {user})
        
    })
})

app.delete('/session', (req, res) => {
    req.session.destroy((err) => {
    if (err) {
        console.log(err)        
    }
    res.redirect('/')

    })
})

app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`)
  })