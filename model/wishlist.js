const mongoose=require('mongoose')

const wishlistSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'addproduct' },
        quantity: { type: Number, default: 1 },
        createdAt: { type: Date, default: Date.now }  // Corrected field name
    }]
});
 const wishlist=mongoose.model('wishlist',wishlistSchema)
 module.exports=wishlist
