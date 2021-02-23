require('dotenv').config();
const cors = require('cors')
const express = require('express')

const app = express()

//middle ware
    //cors
app.use(cors())
    //bodyparsing middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Routes
app.get('/', (req,res) =>{
    res.json({message: "MERN app API Home"})
})

//controllers
app.use('/api', require('./controllers/auth')) 
app.use('/user', require('./controllers/user'))

app.listen(process.env.PORT || 3000, () =>{
    console.log(`✅ You are listening to to smooth sounds of Port ${process.env.PORT || 3000}`)
})