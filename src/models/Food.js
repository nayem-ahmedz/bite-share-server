const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    donator: { type: String, required: true },
    email: { type: String, required: true },
    donatorPhoto: { type: String },
    foodName: { type: String, required: true },
    foodQuantity: { type: Number, required: true },
    pickupLocation: { type: String, required: true },
    expireDate: { type: Date, required: true },
    notes: { type: String },
    imageUrl: { type: String, required: true },
    foodStatus: { type: String, default: 'Available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', foodSchema);