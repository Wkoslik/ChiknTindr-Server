//require passport
const passport = require('passport')
const Strategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const db = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// construct the strategy
const options = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
const findUser = (jwt_payload, done) => {
    db.User.findById(jwt_payload.id)
        .then(user => done(null, user))
        .catch(done)
}
const strategy = new Strategy(options, findUser)


//register the strategy so passport uses it when we call 'passport.authenticate()' in our routes
passport.use(strategy);

//initialize passport
passport.initialize();

//write function that creates a jwt token
const createUserToken = (req, user) => {
    //check the password from req.body against the user
    const validPassword = bcrypt.compareSync(req.body.password, user.password)

    //if we didn't get a user or the password isn't valid, throw an error
    if (!user || !validPassword) {
        const err = new Error('Invalid Credentials ❌')
        err.statusCode = 422
        throw err
    } else { //otherwise create and assign a new token
        return jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2000m' } 
        )
    }
}

module.exports = { createUserToken }