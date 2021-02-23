//user.js handles all routes the user will be on with the exception of signup and login which are handled by auth
//This can be renamed or resorted

const express = require('express')
const db = require('../models')
const router = express.Router()
const passport = require('passport')

router.get('/', (req,res) =>{
    //display main landing page after a user has logged in but before the user...
    //..has created an instance with a friend
    
})
router.get('/profile', (req, res) => {
    // call for user model data for self
        // profile updates and other display for other info info
        // is this just handled for auth? /private?

})
//* put req allow user read and update 
router.get('/preferences', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.status(201).json({ message: 'Thou hast granted the glorious chinkn tindr message'})
    console.log(req.user._id)
    console.log(req.user)
})
    

router.put('/preferences/update', (req, res) =>{
    //will accept form data and update the database 
})

router.post('/invite', (res, req) =>{
    //accepts form data to create the invite to a friend
})

router.get('/:id', (req, res) =>{
    //this is for the instance that's created between friends
})

module.exports = router;