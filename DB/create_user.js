require('dotenv').config()
const pg = require('pg')
const bcrypt = require('bcrypt')
const db = require('./index.js')



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


