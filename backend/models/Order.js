const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},

    items: [
        {
            productID: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, required: true, min: 1},
            price: {type: Number, required: true}
        }
    ],
    totalAmount: {type: Number, required: true},
    address:{
        fullName: {type: String, required: true},
        addressLine1: {type: String, required: true},
        addressLine2: {type: String},
        postalCode: {type: String, required: true},
        city: {type: String, required: true},//do something like this in the frontend to get the city from the postal code
        country: {type: String, required: true}
    },
    paymentID: {type: String, required: true},
    status: {type: String, enum: ['ordered', 'shipped', 'delivered'], default: 'ordered'}
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);