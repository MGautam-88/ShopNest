const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
}, { _id: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    addresses: [addressSchema],
}, { timestamps: true });//This will tell us when the user was created and when it was last updated

module.exports = mongoose.model('User', userSchema); // This will create a collection named 'User' in db and follow the 'userSchema' structure!
