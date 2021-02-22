const bcrypt = require('bcrypt')
const express = require('express')
const db = require('../models')
const router = express.Router()
const { createUserToken } = require('../middleware/auth')
const passport = require('passport')
const jwt = require('jsonwebtoken')

//URL prefix - '/api'


//signup - POST /api/signup
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10) //do 10, 11, or 12
        .then(hash => db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash
        }))
        .then(createdUser => res.status(201).json({
            token: createUserToken(req, createdUser),
            user: createdUser
        }))
        .catch(err => {
            console.log(`🔥 error in the post signup`, err)
            res.status(401).json({ error: err.message })
        })
})

//login POST /api/login
router.post('/login', (req, res) => {
    //if login details are correct
    db.User.findOne({ email: req.body.email })
        .then(user => { //create and send a token via createUserToken
            res.status(201).json({
                token: createUserToken(req,user),
                user: user
            })
        }).catch(err => {    //otherwise
            //send an error
            console.log('🔥 error in teh post login route', err)
            res.status(401).json({ error: err.message })
        })
})

//GET  Test route
router.get('/private', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.status(200).json({ message: 'Thou hast been granted permission to access this message'})
})

//PUT /api/user
router.put('/user/', passport.authenticate('jwt', {session: false}), (req, res) =>{
    // ----------THIS IS THE HARD WAY---------- 
    //get the token from the reqheaders
    // console.log(req.headers.authorization)
    // let token  = req.headers.authorization.split(' ')[1]
    // console.log(token)
    //decode the token to get payload details
    // let decoded = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(decoded)
    //update a user based on the id from token and update info from body
    // db.User.findByIdAndUpdate(decoded.id, {name: req.body.name})
    // .then(user =>{
    //     res.status(201).json(user)
    // })
    // ----------THIS IS THE EASY WAY---------- 

    db.User.findByIdAndUpdate(req.user._id, { name: req.body.name })
    .then(user => {
        res.status(201).json(user)
    })
})

// userPrefecences
router.put('/user/preferences', passport.authenticate('jwt', {session: false}), (req, res) =>{
    db.User.findByIdAndUpdate(req.user._id, {
        preferences: req.body.preferences
    })
    .then(user => {
        res.status(201).json(user)
    })
})

// userSearch
router.get('/user/search', passport.authenticate('jwt', {session: false}), (req, res) =>{
    db.User.findOne({ email: req.body.email})
    .then(user => {
        res.status(200).json(user.preferences)
        user.preferences.userPreferences.forEach(pref =>{
            console.log(pref)
        })
    })
})

module.exports = router;
