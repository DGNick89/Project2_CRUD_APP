const express = require('express')
const router = express.Router()
const db = require('../DB')
const ensureLoggedIn = require('../middleware/ensure_logged_in')
const bcrypt = require('bcrypt')

router.get('/new', (req, res) => {
  
    res.render('new')
})


router.post('/new', (req, res) => {
    
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
        res.redirect('/')
    })
}) 

router.get('/game/:id', (req, res) => {
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
            
            const sql = `
            SELECT players_joined.*,
            users.name, users.profile_pic FROM players_joined
            JOIN users on players_joined.user_id = users.id
            WHERE game_id = $1;
            `
            
            let game = result.rows[0]
            let noPlayers = 'Be the first to join this game!'
            db.query(sql, [req.params.id], (err, result) => {
                let players = result.rows
                if (err) {
                    console.log(err)                    
                }
                if (players === 0) {
                    noPlayers
                }                
                        
                console.log(players);               
                res.render('index', {game, players, noPlayers})
            })
            
        })
    
})

router.post('/game/:id', (req, res) => {
    let sql = `
    INSERT INTO players_joined
    (game_id, user_id)
    VALUES
    ($1, $2);
    `
    db.query(sql, [req.params.id, req.session.userId], (err, result) => {
        if (err) {
            console.log(err) 
        }
        res.redirect(`/game/${req.params.id}`)
        
    })
})

router.get('/game/edit/:id', (req, res) => {
    let sql =`
    SELECT * FROM games
    WHERE id = $1;
    `
    db.query(sql, [req.params.id], (err, result) => {
        if(err) {
            console.log(err)            
        }
        let game = result.rows[0]
        console.log(req.body);
        console.log(game);
        
        res.render('game_edit', {game})
    })
    
})

router.put('/game/edit/:id', (req, res) => {
    let sql = `
    UPDATE games
    SET location = $1,
    time = $2
    WHERE id = $3;
    `
    db.query(sql, [req.body.location, req.body.time, req.params.id],(err, result) => {
        if (err) {
            console.log(err)                       
        }
        res.redirect(`/game/${req.params.id}`)
    })
})

router.get('/sports/:id', (req, res) => {
    let sql = `
    SELECT games.*, 
    users.name, users.profile_pic FROM games 
    JOIN users on 
    games.user_id = users.id
    where sport = $1
    `
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err)            
        }
        let sports = result.rows
        res.render('sports', {sports})
    })
})

module.exports = router