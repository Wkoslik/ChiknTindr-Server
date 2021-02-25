
// Require Mongoose 
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema
const options = {
  timestamps: true,
}
// restaurant schema
const restSchema = new Schema({
  name: String,
  rating: Number,
  price: String,
  yelpID: String,
  number: String,
  categories: Array, //Array will come back with yelp objects structured alias / display 
  yelpUrl: String,
  imageUrl: String,
  location: Array, //can get display address or combo address details
  match: {
    liked: Array,
    complete: {
      type: Boolean,
      default: false
    }, 
    creatorVoted: {
      type: Boolean,
      default: false
    }, 
    playerVoted: {
      type: Boolean,
      default: false
    } 
  }
})
//* changing instance to matchgame for semantic sense
// Instance schema
//TODO: refactor for any yelp API Call snags
  //TODO: Add a total restaurants
const matchGameSchema = new Schema({
  name: String,
  users: [{
    type: MONGOOSE.Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: String,
  player: String,
  creatorArr: Array,
  playerArr: Array,
  creatorFinished: {
    type: Boolean,
    default: false
  },
  playerFinished: {
    type: Boolean,
    default: false
  },
  location: String,
  term: String,
  preference: Array,
  price: Array,
  date: {type: Date, default: Date.now()},
  dateCreated: {type: Date, default: Date.now()},
  restaurants: [restSchema],
  completed: Boolean,
  started: {
    type: Boolean,
    default: false
  },
  result: {
    name: String,
    yelpID: String
  }
}, options)

// export 
module.exports = MONGOOSE.model('MatchGame', matchGameSchema)