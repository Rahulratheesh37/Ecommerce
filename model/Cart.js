const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'addproduct' },
        quantity: { type: Number, default: 1 },
        createdAt: { type: Date, default: Date.now }  // Corrected field name
    }]
});

const carts = mongoose.model('carts', CartSchema);  // Model name should be singular
module.exports = carts;
