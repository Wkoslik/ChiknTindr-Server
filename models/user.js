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

const userInstanceSchema = new mongoose.Schema({
	instance: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Instance'
	},
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	complete: Boolean
})


//*  User Favorite 
const userFaveSchema = new mongoose.Schema({
	name: String,
	yelpID: String,
	imgUrl: String
});

// TODO: add userChat to user after chat model has been built 
const userChatSchema = new mongoose.Schema({
	chatId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Chat'
	},
	name: {type: String, default: "chat"},
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
});


//* User Schema
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
	
	friendsList: [{
		userId: {type: mongoose.Schema.Types.ObjectId,  ref: 'User' },
		name: String,
}],
	userInstances: [userInstanceSchema],
	preferences:{
		userPreferences: Array,
		wantToGo: Array,
		favorites: [userFaveSchema]
	},
	chats: [userChatSchema]
}, options)

module.exports = mongoose.model('User', userSchema)