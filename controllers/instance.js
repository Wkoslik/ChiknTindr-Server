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
//TODO: ensure theres at least a restaurant found, return and error to the user that is specific to searching for something less specific etc....
router.patch('/start', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('HIT START ROUTE 🦄🦄🦄🦄🦄')
  // console.log(req.body.objectId)
  db.MatchGame.findOne({ _id: req.body._id })
    .then(foundGame => {
      console.log(foundGame)
      //* Data Returned from Game */
      //* Handle information that comes back and parse into query term 
      if (foundGame.started === false) {
        foundGame.started = true;
        console.log(foundGame, '👀👀👀👀👀👀👀👀👀')
        // foundGame.preference = array of the preferences as strings must combine them
        const gamePref = foundGame.preference.join();
        console.log(gamePref);
        // price array of prices as strings
        //parse int and do math compare / switch for price search term 
        const minPrice = Math.min(...foundGame.price)
        console.log(`attempt at minimum user price ${minPrice}`)
        //     //TODO: For now use "1,2" in search always until logic can be updated
        //   //*Build the query term 
        const yelpBaseUrl = 'https://api.yelp.com/v3/businesses/search';

        const axiosURL = `${yelpBaseUrl}?location=${foundGame.location}&term=${foundGame.term},${gamePref}&price=1,2&limit=5` //TODO: Fix price here



        // //*  Make the Axios Call
        axios.get(axiosURL, {
          headers: {
            Authorization: `Bearer ${process.env.YELP_KEY}`
          }
          // could add params here later
        }).then(response => {
          console.log(response.data.businesses)
          response.data.businesses.forEach(eatz => {
            foundGame.restaurants.push(
              {
                name: eatz.name,
                yelpNum: eatz.id,
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
          // Update the users from the game 

          console.log(foundGame)
          res.status(201).json(foundGame)
          // console.log(foundGame);
          // res.status(201).json(response)
          // res.send(response.data.businesses)
        })
      } else {
        res.status(201).json(foundGame)
      }
    })


});
//* Match results and do a database write for restaurants */
// res.status(200).json(foundGame)


//get detail for one game 
router.get('/onegame', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.MatchGame.findOne({ _id: req.body._id })
    .then(foundGame => {
      console.log(foundGame)
      res.status(201).json(foundGame)
    })
})

//TODO: Restaurants for display and like action 
// Client pulls game instance using req.params.id 
//? /game/restuarants/:id
router.get('/restaurants/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.MatchGame.findById(req.params.id)
    .then(game => {
      console.log(game)
      res.status(201).json(game)
    })
})





router.patch('/gameVote', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.MatchGame.findOne({ _id: req.body.instanceId })
    .then(game => {
      const creator = game.creator;
      if (creator === req.user.email) {
        const restInGame = game.restaurants.id(req.body.restId)
        restInGame.match.creatorVoted = true;
        restInGame.match.liked.push(req.body.vote)
        game.creatorArr.push(req.body.vote)
        if (game.creatorArr.length === game.restaurants.length) {
          game.creatorFinished = true;
          for (i = 0; i < game.creatorArr.length; i++) {
            if (game.creatorArr[i] === game.playerArr[i]) {
              game.completed = true;
              game.result.yelpAPI = game.restaurants[i].yelpNum;
              game.result.name = game.restaurants[i].name;

            }
          };
        } else {
          for (i = 0; i < game.creatorArr.length; i++) {
            if (game.creatorArr[i] === game.playerArr[i]) {
              game.completed = true;
              game.result.yelpAPI = game.restaurants[i].yelpNum;
              game.result.name = game.restaurants[i].name;

            }
          };
        }
        game.save()
        res.status(201).send(game)
      }
      const player = game.player
      if (player === req.user.email) {
        const restInGame = game.restaurants.id(req.body.restId)
        restInGame.match.playerVoted = true;
        restInGame.match.liked.push(req.body.vote)
        game.playerArr.push(req.body.vote)
        if (game.playerArr.length === game.restaurants.length) {
          game.playerFinished = true;
          for (i = 0; i < game.playerArr.length; i++) {
            if (game.playerArr[i] === game.creatorArr[i]) {
              game.completed = true;
              game.result.yelpAPI = game.restaurants[i].yelpNum;
              game.result.name = game.restaurants[i].name;

            }
          };
        } else {
          for (i = 0; i < game.playerArr.length; i++) {
            if (game.playerArr[i] === game.creatorArr[i]) {
              game.completed = true;
              game.result.yelpAPI = game.restaurants[i].yelpNum;
              game.result.name = game.restaurants[i].name;

            }
          };
        }
        game.save()
        res.status(201).send(game)
      }
    })
})
//Update each restaurant:
/*
  liked array - push boolean update ever vote
  creator voted -boolean - update corresponding vote
  player voted -boolean - update corresponding vote 
  complete - boolean if both users have liked
 */
//TODO: Nested logic for moving to results 
// grab matches, switch on user lists, update matchgame model

//get business details  

router.get('/result/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.params)
  const yelpBaseUrl = 'https://api.yelp.com/v3/businesses';

  const axiosURL = `${yelpBaseUrl}/${req.params.id}`

  // // //*  Make the Axios Call
  axios.get(axiosURL, {
    headers: {
      Authorization: `Bearer ${process.env.YELP_KEY}`
    }
  
  }).then(response => {
    res.status(201).json(response.data)
  })
  .catch(err =>{
    res.status(500).json(err)
  })
})


module.exports = router;

//Planning any middlewear
  //TODO: Write non REST logic functions
