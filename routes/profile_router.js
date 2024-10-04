const express = require('express')
const router = express.Router()
const db = require('../DB')
const bcrypt = require('bcrypt')
const ensureLoggedIn = require('../middleware/ensure_logged_in')

router.get('/profile/:id', (req, res) => {
    let sql = `
    SELECT * FROM
    users
    WHERE id = $1;
    `
        db.query(sql, [req.session.userId], (err, result) => {
            if (err) {
                console.log(err)                
            }
            let user = result.rows[0]
            res.render('profile', {user})
        })
    
})

router.get('/profile/edit/:id', (req, res) => {
    let sql = `
    SELECT * FROM
    users
    WHERE id = $1;
    `
        db.query(sql, [req.session.userId], (err, result) => {
            if (err) {
                console.log(err)                
            }
            let user = result.rows[0]
            res.render('edit', {user})
        })
})

router.put('/profile/edit/:id', (req, res) => {
    const sql = `
    UPDATE users
    SET name = $1,
    email = $2,
    profile_pic = $3
    WHERE id = $4;
    `
    db.query(sql, [req.body.name, req.body.email, req.body.profile_pic, req.session.userId], (err, result) => {
        if(err) {
            console.log(err)            
        }
        console.log(req.body);
        
        res.redirect(`/profile/${req.session.userId}`)
    })
})

module.exports = router