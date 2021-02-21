const db = require('./models')

// ------ Original User Create before hash

// db.User.create({
//     name: 'Billy Bob',
//     email: 'test1@test.com',
//     password: '123123123'
// }).then(user =>{
//     console.log('🎃 Successfully created a user!')
//     console.log(user)
//     process.exit()
// }).catch(err => {
//     console.log('👹 error creating user:\n${err}')
//     process.exit()
// })

// -------- DB Test modeling 
    //TODO: scratch model structure and basic writing logic