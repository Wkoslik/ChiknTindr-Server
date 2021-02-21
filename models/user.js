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
		type: MONGOOSE.Schema.Types.ObjectId,
		ref: 'Instance'
	},
	users: [{
		type: MONGOOSE.Schema.Types.ObjectId,
		ref: 'User'
	}],
	complete: Boolean
})

// const prefSchema = new mongoose.Schema({
// 	preferences: Array,
// 	wantToGo: Array,
// 	favorites: [{
// 		name: String,
// 		yelpId: String, 
// 		img: String
// 	}]
// })
const userChatSchema = new.mongoose.Schema({
	chatId: {
		type: MONGOOSE.Schema.Types.ObjectId,
		ref: 'Chat'
	},
	name: {type: String, default: "chat"},
	users: [{
		type: MONGOOSE.Schema.Types.ObjectId,
		ref: 'User'
	}]
})


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
	location: {
		zip: Number,
		address: String,
		city: String,
	},
	friendsList: [{
		type: MONGOOSE.Schema.Types.ObjectId,
		ref: 'User'
	}],
	userInstances: [userInstanceSchema],
	preferences:{
		userPreferences: Array,
		wantToGo: Array,
		favorites: [{
		name: String,
		yelpId: String, 
		img: String
		}]
	},
	chats: [userChatSchema]
}, options)

module.exports = mongoose.model('User', userSchema)