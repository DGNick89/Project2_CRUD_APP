const express = require('express')
const router = express.Router()
const db = require('../DB')
const bcrypt = require('bcrypt')

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', (req, res) => {
    
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
                res.render('home')
            })
        })
    })
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login' ,(req, res) => {
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

router.delete('/session', (req, res) => {
    req.session.destroy((err) => {
    if (err) {
        console.log(err)        
    }
    res.redirect('/')

    })
})
module.exports = router