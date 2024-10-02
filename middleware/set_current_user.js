const db = require('../DB')

function setCurrentUser(req, res, next) {
res.locals.isLoggedIn = false    
res.locals.currentUser = {}

    if(!req.session.userId){
        return next()
    }
    
    const sql = `
    SELECT *
    FROM users
    WHERE id = $1
    `

    db.query(sql, [req.session.userId], (err, result) => {
        if (err) {
            console.log(err)        
        }

        let user = result.rows[0]
        res.locals.currentUser = user
        res.locals.isLoggedIn = true

        next()
    })
}

module.exports = setCurrentUser