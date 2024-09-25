const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    addresssId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Addresses'},
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'addproduct' },
        quantity: Number,
        createdAt: { type: Date, default: Date.now }  // Corrected field name
    }],
    PaymentTYpe:{type:String},
    TotalCartPrice:{type:String},
    ProductCount:{type:String},
    status:{type:String,default:"pending"}
});
const order=mongoose.model('order',orderSchema);
module.exports=order;