const mongoose = require('mongoose')

const options = {
    timestamps: true,
    id: false,
    toJSON: {
        virtuals: true,
        transform: (_doc, userDocToReturn) =>{
            delete userDocToReturn.password
            return userDocToReturn
        }
    }
}
//TODO: create location, FriendsList, ctInstance, Prefrences, chats Schema for Embedding
// location Schema

// friendsList Schema - ref other users only refrence array for now

// ctInstance Schema - "Chikn Tindr instance" -ref to model object id

// Prefrence Schema - Pref array 
    // or their own embedded schema? Initially containing Fav Rest and Want to go?


// userChat Schema

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    //TODO: Add User: location, FL, ctInstance, Prefrences
    friendsList: [{
        type: MONGOOSE.Schema.Types.ObjectId,
        ref: 'User'
    }],
    ctInstance: [ctInstance]
}, options)

module.exports = mongoose.model('User', userSchema)