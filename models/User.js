const {Schema, model} = require('mongoose')
const Role = require('./Role')


const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: { type: String, required: true },
    roles: [{type: String, ref: 'Role'}]
})

module.exports = model('User', User)
