//user.js handles all routes the user will be on with the exception of signup and login which are handled by auth
//This can be renamed or resorted

const express = require('express')
const db = require('../models')
const router = express.Router()

router.get('/', (req,res) =>{
    //display main landing page after a user has logged in but before the user...
    //..has created an instance with a friend
    
})

router.get('/preferences', (req, res) => {
    //display all users preferences on the screen
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