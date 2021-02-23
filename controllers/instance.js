//TODO: Finish this controller and plan routes

// Import requirments and dependencies
const express = require('express')
const db = require('../models')
const router = express.Router()
const passport = require('passport')

// router / controller routes
  // Displaying all user Games / Instances
  // Displaying a particular instance

  // GET and PATCH request to read the game instance and make a search
router.get('/start',  passport.authenticate('jwt', { session: false }), (req, res) => {
  db.MatchGame.findByIdAndUpdate({_id: req.body._id})
  .then(foundGame =>{
    console.log(foundGame)
    res.status(200).json({ preferences: foundGame.preference,location: foundGame.location, term: foundGame.term })
  })
})

module.exports = router;
  // Showing all the restaurant data

  // refactoring logic for data / game state logic

  //Writing selections from front end 

//Planning any middlewear
  //TODO: Write non REST logic functions
  