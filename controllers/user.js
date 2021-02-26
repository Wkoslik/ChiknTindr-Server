//user.js handles all routes the user will be on with the exception of signup and login which are handled by auth
//This can be renamed or resorted
//TODO: in general user returns from backend have password there middle wear or a hook in the model that can prevent the user from having the hashed password?, Is this not an issue especially since other users can be read?


const express = require('express')
const db = require('../models')
const router = express.Router()
const passport = require('passport')

router.get('/', (req, res) => {
    //display main landing page after a user has logged in but before the user...
    //..has created an instance with a friend

})
router.get('/profile', (req, res) => {
    // call for user model data for self
    // profile updates and other display for other info info
    // is this just handled for auth? /private?

})
//* put req allow user read and update 
router.put('/preferences', passport.authenticate('jwt', { session: false }), (req, res) => {
    // res.status(201).json({ message: 'Thou hast granted the glorious chinkn tindr message'})
    // console.log(req.user._id)
    // console.log(req.user._id)
    db.User.findByIdAndUpdate(req.user._id, {
        preferences: { foodPreferences: [req.body.dietary], foodPrice: req.body.price }
    }).then(user => {
        console.log(user)
        res.status(201).json(user)
    })
});
    //TODO: TODO check user instance and any front end based update to the user model instance stuff whitney added
router.post('/invite', passport.authenticate('jwt', { session: false }), (req, res) => {
    db.User.findOne({ email: req.body.email })
        .then(foundUser => {
            // console.log(req.body.email)
            // console.log(user.email)
            if (!foundUser._id) return
            console.log(foundUser._id)
            console.log(req.user._id)
            db.MatchGame.create({
                name: req.body.description,
                users: [foundUser._id, req.user._id],
                creator: req.user.email,
                player: foundUser.email,
                location: req.body.location,
                term: req.body.categoryInput,
                preference: [req.user.preferences.foodPreferences[0], foundUser.preferences.foodPreferences[0]],
                price: [req.user.preferences.foodPrice, foundUser.preferences.foodPrice],
                dateCreated: Date.now(),
                completed: false,
                started: false,
            }).then(createdGame => {
                // Update User logged in
                //TODO: Add a help function / method to use array include javascript method to determine if a user already has invitee as a friend then do nothing if not add to friend array
                db.User.findByIdAndUpdate(
                    { _id: req.user._id },
                    {
                        userInstances: [{
                            instance: createdGame._id,
                            name: createdGame.name,
                            users: [foundUser._id, req.user._id],
                            complete: false
                        }, ...req.user.userInstances
                        ]
                    }).then(user1 => console.log(`User 1: Game pushed to model:\n ${user1}`))
                // update user invited
                db.User.findByIdAndUpdate(
                    { _id: foundUser._id },
                    {
                        userInstances: [{
                            instance: createdGame._id,
                            name: createdGame.name,
                            users: [foundUser._id, req.user._id],
                            complete: false
                        }, ...foundUser.userInstances
                        ]
                    }).then(user2 => console.log(`User 2: Game pushed to model:\n ${user2}`))
                    console.log(createdGame)
                res.status(200).json(createdGame)
            })
        }).catch(err => {
            console.log(`Error no such user! ${err}`)
            res.status(400).json({ message: "sorry there isnt a user" })
        })
});

// Testing route for User info
// at /user/test
router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Checking in the logged user
    console.log(`🐙🐙🐙🐙🐙🐙 Signed in User ${req.user}`)
    console.log(`🚨🚨🚨🚨🚨🚨 signed in user preferences ${req.user.preferences}`)

    // checking the user searched 

    db.User.findOne({ email: req.body.email })
        .then(userSearched => {
            console.log(`🥶🥶🥶🥶🥶 searched user ${userSearched}`);
            console.log(`🧢🧢🧢🧢🧢🧢 searched user preferences ${userSearched.preferences}`);
            res.status(201).json(userSearched.preferences)
        })
})


//test no user solve 
router.get('/test/nouser', passport.authenticate('jwt', { session: false }), (req, res) => {
    db.User.findOne({ email: req.body.email })
    .then(foundUser => {
        console.log(foundUser.name)
        res.status(201).json({ message: "there is a user" })
    }).catch(err => {
        console.log(`Error no such user! ${err}`)
        res.status(400).json({ message: "sorry there isnt a user" })
    })
})


// router.get('/:id', (req, res) => {

//     //this is for the instance that's created between friends
// })
//TODO: Populate on game instance
//TODO: pair down and pipeline necessary query stuff
//TODO: Conditional rendering 
router.get('/plans',  passport.authenticate('jwt', { session: false }), (req, res) => { 
      //old method
    db.User.findById(req.user)
    .then(response =>{
        res.send(response)
    })
});

router.get('/plansNew', passport.authenticate('jwt', { session: false }), (req, res) => {
    // req.user._id?
    db.User.findById(req.user._id)
        .populate({
            path: 'userInstances.instance',
            model: 'MatchGame'
        
        }).exec((err, userGames) => {
                let instArr = []
            userGames.userInstances.forEach(game =>{
                let instanceObj = {
                    name: game.name,
                    _id: game._id,
                    instance: game.instance._id,
                    complete: game.instance.completed,
                    started: game.instance.started,
                    creator: game.instance.creator,
                    player: game.instance.player,
                    creatorFinished: game.instance.creatorFinished,
                    playerFinished: game.instance.playerFinished,
                    result: game.instance.result
                }
                instArr = [instanceObj,...instArr]
            })
            console.log(instArr);
            res.status(201).json(instArr)
        })
})
    //old method
    // db.User.findById(req.user)
    // .then(response =>{
    //     res.send(response)
    // })
    // //res.status.json
    //send user found user.userinstances


//TODO Remove this route, this is just to test the front end hitting the backend

router.get('/test/nouser2', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('YOU HIT THE BACKEND')
})
    //     //this is for the instance that's created between friends
    // })
  
    
    //TODO Remove this route, this is just to test the front end hitting the backend
    
    router.get('/test/nouser2', passport.authenticate('jwt', { session: false }), (req, res) => {
        console.log('YOU HIT THE BACKEND')
    })
    
    //TODO: Friends List testing
    //get a user by email
    router.get('/search', passport.authenticate('jwt', { session: false }), (req, res) => { 
        db.User.findOne({ email: req.body.email })
        .then(foundUser =>{
            console.log(foundUser)
            res.status(201).json(foundUser)
        })
    })
    //TODO: Add same helper function here to check array.includes boolean to determine whether or not it actually adds a friend or not if the friend already exists
    // add a friend route
    router.patch('/addfriend',  passport.authenticate('jwt', { session: false }), (req, res) => {
        db.User.findOne({_id: req.user._id})
        .then(mainUser =>{
            console.log(req.body._id)
            mainUser.friendsList.push(req.body._id)
            mainUser.save()
            console.log('friendship success 🍑 🍑 🍑 🍑 🍑 🍑')
            res.status(201).json(mainUser);
        })
})
// display friends route and populate 

    router.get('/friendslist', passport.authenticate('jwt', { session: false }), (req, res) => {
        db.User.findOne({_id: req.user._id})
            .populate('friendsList').exec((err, userFriends) =>{
                let friendListArray = [];

                console.log(userFriends);
                userFriends.friendsList.forEach(friend =>{
                    let friendObj = {
                        name: friend.name,
                        email: friend.email
                    }
                    friendListArray = [friendObj, ...friendListArray]
                })
                console.log(friendListArray);
                    //for each loop make a new object to send
                res.status(201).json({ friendslist: friendListArray });
            })
        })


module.exports = router;