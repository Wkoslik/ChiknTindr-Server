const mongoose = require('mongoose')
const Schema = mongoose.Schema;

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

//* User instances 
const userInstanceSchema = new Schema({
	instance: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'MatchGame'
	},
	name: String,
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	complete: Boolean,
	started: {
		type: Boolean,
		default: false
	}
}, {timestamps: true})


//*  User Favorite
const userFaveSchema = new Schema({
	name: String,
	yelpID: String,
	imgUrl: String
});

// TODO: add userChat to user after chat model has been built 
const userChatSchema = new Schema({
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
const userSchema = new Schema({
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
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User' 
}],
	userInstances: [userInstanceSchema],
	preferences:{
		foodPreferences: [String],
		foodPrice: String,
		wantToGo: Array,
		favorites: [userFaveSchema]
	},
	chats: [userChatSchema]
}, options)

module.exports = mongoose.model('User', userSchema)