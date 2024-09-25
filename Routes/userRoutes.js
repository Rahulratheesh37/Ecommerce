
const express = require('express');
const controller = require('../controllers/userController');
const userroute = express.Router();
const Authentication=require('../middleware/midleware');

 userroute.get('/home',controller.gethome)
.get('/login', controller.getlogin)
.post('/login',controller.postlogin)
.get('/logout',controller.getLogout)
.get('/AddUserDetails',controller.getUserProfile)
.post('/AddUserDetails',controller.postUserProfile)

.get('/signup', controller.getsignup)
.post('/signup',controller.postSignup)

//otp
.post('/OtpValidation',controller.postOtpValidation)
.post('/OtpVerify',controller.postOtpVariefy)

//cart
.get('/carts',Authentication,controller.getCart)
.post('/carts/:id',Authentication,controller.postcart)

// product details
.get('/product-detail/:id',Authentication,controller.getProductDetails)

//fetchQuanty from cart page
.post('/fetchQuanty',controller.fetchQuanty)
//remove product from cart
.post('/removeCart',controller.removeCart)
//wishlist

.post('/Wishlist',Authentication,controller.postwishlist)
.get('/Wishlist',Authentication,controller.getwishlist)
//update quantity

.post('/Wishlist/quantity',controller.WishlistQuanty)
//remove
.post('/Wishlist/remove',controller.removeWishlist)
// buy

.get('/buyNow/:id',controller.getBuyNow)

.get('/product',controller.getproduct)

.get('/men',controller.getmen)
.get('/women',controller.getwomen)
.get('/about',controller.getabout)
// .get('/checkout', Authentication,controller.getcheckout)


//order

// .post('/placeOrder',controller.postOrder)

module.exports=userroute

