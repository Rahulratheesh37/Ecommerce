const mongoose = require('mongoose')

const signupSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    password2: String,
    phoneNumber:Number,  
    block:{
        type: Boolean,
        default:false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'//default:role is user
    },
    createdAT: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('user', signupSchema);
module.exports = User;