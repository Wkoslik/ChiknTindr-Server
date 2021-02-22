
// Require Mongoose 
const MONGOOSE = require('mongoose');
const options = {
  timestamps: true,
}
// restaurant schema
const restSchema = MONGOOSE.Schema({
  name: String,
  rating: Number,
  price: String,
  yelpID: String,
  number: String,
  categories: Array, 
  url: String,
  imageUrl: String,
  // coordinates: {
  //   longitude: String,
  //   lattitude: String
  // },
  location: Array,
  chinknTindr: {
    users: Array,
    match: {
      type: Boolean,
      default: false
    } 
  }
})

// Instance schema
const instanceCTSchema = MONGOOSE.Schema({
  users: [{
    type: MONGOOSE.Schema.Types.ObjectId,
    ref: 'User'
  }],
  date: {type: Date, default: Date.now},
  restaurants: [restSchema],
  completed: Boolean,
  result: {
    name: String,
    yelpID: String
  }
}, options)

// export 
module.exports = mongoose.model('InstanceCT', instanceCTSchema)