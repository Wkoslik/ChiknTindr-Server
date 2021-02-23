
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
    match: {
      type: Boolean,
      default: false
    } 
  }
})
//* changing instance to matchgame for semantic sense
// Instance schema
//TODO: Add dietary and Price preference here to be used for query to Yelp API
//TODO: refactor for any yelp API Call snags
const matchGameSchema = new Schema({
  name: String,
  users: [{
    type: MONGOOSE.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: String,
  term: String,
  date: {type: Date, default: Date.now()},
  dateCreated: {type: Date, default: Date.now()},
  restaurants: [restSchema],
  completed: Boolean,
  result: {
    name: String,
    yelpID: String
  }
}, options)

// export 
module.exports = MONGOOSE.model('MatchGame', matchGameSchema)