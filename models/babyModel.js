const mongoose = require('mongoose');
const BabySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    birthdate: {
        type: Date,
        required: [true, 'Please provide a birthdate']
    },
    gender: {
        type: String,
        required: [true, 'Please provide a gender']
    },
    address:{
        type: String,
        required: [true, 'Please provide an address']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        vakidate : [validator.isEmail, 'Please provide a valid email']
    },
    password:{
        type: String,
        required: [true, 'Please provide a password']
        
    }
},{timestamps: true});

const BabyModel = mongoose.model('Baby', BabySchema);
module.exports = BabyModel;