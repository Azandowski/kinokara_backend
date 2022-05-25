const {Schema, model} = require('mongoose')


const Post = new Schema({
    value: { type: String },
    username: { type: String, unique: false, required: true },
    userId: { type: String, unique: false, required: true },
    datePost: { type: Date, unique: false, required: true },
    review: { type: Number, unique: false, required: true },
    valid: { type: Boolean, default: false, required: true },
})

module.exports = model('Post', Post)