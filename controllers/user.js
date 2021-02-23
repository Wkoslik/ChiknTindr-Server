//user.js handles all routes the user will be on with the exception of signup and login which are handled by auth
//This can be renamed or resorted

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
    console.log(req.user._id)
    db.User.findByIdAndUpdate(req.user._id, {
        preferences: { foodPreferences: [req.body.dietary], foodPrice: req.body.price }
    }).then(user => {
        console.log(user)
        res.status(201).json(user)
    })
});


router.put('/preferences/update', (req, res) => {
    //will accept form data and update the database 
})


router.post('/invite', passport.authenticate('jwt', { session: false }), (req, res) => {
    // res.status(201).json({ message: 'Thou hast granted the glorious chinkn tindr message' })
    // console.log(req.user._id)
    //TODO what happens if the user invited to dinner isn't in our db yet? can we find or create?
    db.User.findOne({ email: req.body.email })
        .then(user => {
            // console.log(req.body.email)
            // console.log(user.email)
            console.log(user._id)
            console.log(req.user._id)
            db.MatchGame.create({
                name: req.body.description,
                users: [user._id, req.user._id],
                location: req.body.location,
                term: req.body.term,
                dateCreated: Date.now(),
                completed: false
            }).then(createdGame => {
                const gameData = {}
                db.User.findByIdAndUpdate(
                    { _id: req.user._id },
                    {
                        userInstances: [{
                            instance: createdGame._id,
                            name: createdGame.name,
                            users: [user._id, req.user._id],
                            complete: false
                        }
                        ]
                    }).then(user1 => console.log(`User 1: Game pushed to model:\n ${user1}`))

                console.log(user.id, user.email)
                db.User.findByIdAndUpdate(
                    { _id: user._id },
                    {
                        userInstances: [{
                            instance: createdGame._id,
                            name: createdGame.name,
                            users: [user._id, req.user._id],
                            complete: false
                        }
                        ]
                    }).then(user2 => console.log(`User 2: Game pushed to model:\n ${user2}`))

                res.status(200).json(createdGame)
            })
        })
});

router.get('/:id', (req, res) => {
    //this is for the instance that's created between friends
})

module.exports = router;