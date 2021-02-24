//TODO: Finish this controller and plan routes

// Import requirments and dependencies
const express = require('express');
const db = require('../models');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');

// router / controller routes
  // Displaying all user Games / Instances
  // Displaying a particular instance

  // GET and PATCH request to read the game instance and make a search
router.patch('/start',  passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('HIT START ROUTE 🦄🦄🦄🦄🦄')
  db.MatchGame.findOne({_id: req.body._id})
  .then( foundGame => {
    console.log(foundGame)
    //* Data Returned from Game */
    //* Handle information that comes back and parse into query term 
    // foundGame.preference = array of the preferences as strings must combine them
      // console.log(foundGame[0].name)
      // console.log(foundGame[0].preference)
      // console.log(foundGame.name)
      // console.log(foundGame.preference)
      const gamePref = foundGame.preference.join();
      console.log(gamePref);
      // price array of prices as strings
        //parse int and do math compare / switch for price search term 
        const minPrice = Math.min(...foundGame.price)
        console.log(`attempt at minimum user price ${minPrice}`)
    //     //TODO: For now use "1,2" in search always until logic can be updated
    //   //*Build the query term 
    //     //base Yelp url:
      const yelpBaseUrl = 'https://api.yelp.com/v3/businesses/search';
  
      const axiosURL = `${yelpBaseUrl}?location=${foundGame.location}&term=${foundGame.term},${gamePref}&price=1,2&limit=10` //TODO: Fix price here

    

    // //*  Make the Axios Call
    axios.get(axiosURL, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_KEY}`
      }
      // could add params here later
    }).then( response => {
      console.log(response.data.businesses)
    response.data.businesses.forEach(eatz =>{
      foundGame.restaurants.push(
        { 
          name: eatz.name,
          yelpId: eatz.id,
          imageUrl: eatz.image_url,
          number: eatz.display_phone,
          categories: eatz.categories,
          yelpUrl: eatz.url,
          price: eatz.price,
          location: eatz.location


        }
        )
      })
      foundGame.save();
      // console.log(foundGame);
      // res.status(201).json(response)
      // res.send(response.data.businesses)
    })
    .then(updatedGame => {
      console.log(updatedGame)
      res.status(201).json(updatedGame)
    })
    
    //* Match results and do a database write for restaurants */
    // res.status(200).json(foundGame)

  })
})
//get detail for one game 
router.get('/onegame',  passport.authenticate('jwt', { session: false }), (req, res) => {
  db.MatchGame.findOne({_id: req.body._id})
  .then(foundGame => {
    console.log(foundGame)
    res.status(201).json(foundGame)
  })
}) 
module.exports = router;
  // Showing all the restaurant data

  // refactoring logic for data / game state logic

  //Writing selections from front end 

//Planning any middlewear
  //TODO: Write non REST logic functions
  