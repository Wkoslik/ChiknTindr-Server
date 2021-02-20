require('dotenv').config()
const mongoose = require('mongoose')

//connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.set('returnOriginal', false)

//console log on open
mongoose.connection.once('open', () =>{
    console.log(`🔗 connected to db: ${mongoose.connection.name}`)
})

//console log on error
mongoose.connection.on('error', err => console.log(`❌ Connection failed`, err))

// export
//TODO: Export other models

module.exports.User = require('./user')