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

//TODO: Move to User controller

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
        user.preferences.foodPreferences.forEach(pref =>{
            console.log(pref)
        })
        res.status(200).json(user)
    })
})

//invite 
router.post('/creatematchgame', passport.authenticate('jwt', {session: false}), (req, res) =>{
    db.User.findOne({ email: req.body.email})
    .then(user => {
        // console.log(req.body.email)
        console.log(user.email)
        console.log(user._id)
        console.log(req.user._id)
        db.MatchGame.create({
            name: req.body.name,
            users: [user._id, req.user._id],
            location: req.body.location,
            term: req.body.term,
            dateCreated: Date.now(),
            completed: false
        }).then(createdGame => {
            const gameData = {}
            db.User.findByIdAndUpdate(
                {_id: req.user._id}, 
                {userInstances : [ {
                        instance: createdGame._id,
                        name: createdGame.name,
                        users: [user._id, req.user._id],
                        complete: false
                    }
                ]}).then(user1 => console.log(`User 1: Game pushed to model:\n ${user1}`))
                
                console.log(user.id, user.email)
            db.User.findByIdAndUpdate(
                {_id: user._id}, 
                {userInstances : [ {
                        instance: createdGame._id,
                        name: createdGame.name,
                        users: [user._id, req.user._id],
                        complete: false
                    }
            ]}).then(user2 => console.log(`User 2: Game pushed to model:\n ${user2}`))
            
            res.status(200).json(createdGame)
        })
    })
})

// Update - from game ref both users for their pref, do logic eval of pref, make query term, axios query to yelp and populate restaurants

module.exports = router;
