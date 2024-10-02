require('dotenv').config()
const pg = require('pg')
const bcrypt = require('bcrypt')
const db = require('./index.js')



let name = 'Nick'
let email = 'nick@sportsAPP.com'
let plainTextPassword = 'sports'
let profilePic = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRnGGwJ6jVmmbR2VV3tTLwK_71S5pB0mY_CKKXH1i3bl5NfNybM'
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
            
        })
    })
})


