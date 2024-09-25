const session = require('express-session');
const bcrypt = require('bcrypt');

//model
const User = require('../model/User');
const products = require('../model/Product')
const carts = require('../model/Cart')
const categorys = require('../model/category');
const Addresses = require('../model/UserDetails');
const wishlist = require('../model/wishlist')

// require twilio
const twilio = require('twilio');
const { default: mongoose } = require('mongoose');

// require env for otp
require('dotenv').config()
const accountSid = process.env.ACCOUNT_SID;
const authTocken = process.env.AUTH_TOCKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const client = new twilio(accountSid, authTocken);
// let removeP;

module.exports = {
    getsignup: (req, res) => {
        const errorm = req.session.errorm || {};
        req.session.errorm = null; // Clear error messages after rendering
        res.render('signup', { errorm });
    },
    getlogin: (req, res) => {
        const errorm = req.session.errorm || {};
        req.session.errorm = null; // Clear error messages after rendering
        res.render('login', { errorm });
    },
    // User Logout
    getLogout: (req, res) => {

        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Error occurred during logout.');
            }
            res.redirect('/product');
        });
    },

    // for login or signup
    gethome: (req, res) => {
        req.session.user = req.session.user;
        res.render('home');
    },
    getproduct: async (req, res) => {
        const productt = await products.find()
        const product = productt.reverse();
        console.log('products', product);
        const Authentication = req.session.isAuth
        res.render('product', { Authentication, product });
    },

    //  show user details

    getUserProfile: async (req, res) => {
        try {
            console.log("Fetching user profile");
            const userId = req.session.user._id;
            console.log("userId:", userId);
            // Fetch user addresses
            const Address = await Addresses.find({ userId: userId });
            console.log("address", Address);

            res.render('UserProfile', { Address });
        } catch (error) {
            console.error("Error fetching user profile:", error.message);
            res.status(500).send('Server error');
        }
    },

    postUserProfile: async (req, res) => {
        try {
            console.log("req", req.body);
            const userId = req.session.user._id;
            const { street, city, state, zip, country, landmark, mobile } = req.body;

            // Create a new address
            await Addresses.create({ street, city, state, zip, country, landmark, mobile, userId });
            // const Add_Id = createAddress._id;

            // Find the user by ID
            // const user = await User.findById(UserId);
            // console.log(user);
            // if (!user) {
            //     return res.status(404).send("User not found");
            // }
            // Update the user's address ID
            // console.log("address id", Add_Id);
            // user.AdressId = Add_Id;
            // await user.save();

            res.redirect('/product');
        } catch (error) {
            console.log(error.message);
            res.status(500).send("An error occurred");
        }
    },

    // user profile drop down

    // men products
    getmen: async (req, res) => {
        try {
            console.log("mens shop");
            // find men products
            const category = await categorys.findOne({ name: "Men" });
            if (!category) {
                res.send("can't find category of men")
            }
            const categoryId = category._id
            console.log("categoryid", categoryId);

            const productsData = await products.find({ category: categoryId });
            if (!category) {
                res.send("can't find category of men")
            }
            const Authentication = req.session.isAuth
            const product = productsData.reverse();
            res.render('men', { product, Authentication });
        } catch (error) {
            console.log(error.message);
        }
    },
    // show product details
    getProductDetails: async (req, res) => {
        console.log("details");
        const productId = req.params.id
        const productz = await products.findById({ _id: productId })
        const wishlists = await wishlist.findById({ _id: productId })
        console.log("find", productz);
        const Authentication = req.session.isAuth
        res.render("product-detail", { productz , Authentication ,wishlists})
    },

    getwomen: (req, res) => {
        res.render('women')
    },
    getabout: (req, res) => {
        res.render('about')
    },
    getcheckout: (req, res) => {
        res.render('checkout');
    },

    // getaddwishlist: () => {
    //     (req, res) => {
    //         res.render('add-to-wishlist')
    //     }
    // },

    postSignup: async (req, res) => {
        const { username, email, password, password2 } = req.body;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        req.session.errorm = {};


        console.log('Password:', password);
        console.log('Password2:', password2);

        if (!email) {
            req.session.errorm.emailError = "Email can't be empty";
        } else if (!emailPattern.test(email)) {
            req.session.errorm.emailError = 'Invalid email format';
        }

        if (!password) {
            req.session.errorm.perror = "Password can't be empty";
        } else if (!passwordPattern.test(password)) {
            req.session.errorm.perror = "Password format is incorrect";
        }

        if (password !== password2) {
            req.session.errorm.cperror = "Passwords do not match";
        }

        if (Object.keys(req.session.errorm).length > 0) {
            return res.redirect('/signup');
        }
        try {
            const checkData = await User.findOne({ $or: [{ username }, { email }] });
            if (checkData) {
                if (checkData.username === username) {
                    req.session.errorm.nameerr = 'Username already exists';
                }
                if (checkData.email === email) {
                    req.session.errorm.emailError = 'Email already exists';
                }
                return res.redirect('/signup');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ username, email, password: hashedPassword });
            res.redirect('/login');
        } catch (error) {
            console.error("Signup error:", error);
            req.session.errorm.globalError = "An error occurred during signup.";
            res.redirect('/signup');
        }
    },


    // otp validation

    postOtpValidation: async (req, res) => {
        console.log("otp");
        console.log(req.body);
        const { phoneNumber } = req.body;
        console.log("mobile", phoneNumber);
        const phonenumber = `+91${phoneNumber}`.replace(/\s+/g, ''); // Remove any spaces
        console.log("Formatted phone number:", phonenumber);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP", otp);
        req.session.OTP = otp;
        try {
            await client.messages.create({
                body: `Your OTP is ${otp}`,
                from: twilioNumber,
                to: phonenumber
            });
            res.json({ success: true, message: 'OTP sent successfully' });
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.json({ success: false, message: 'Failed to send OTP' });
        }

    },
    // check otp variefy

    postOtpVariefy: async (req, res) => {
        try {
            console.log("variefy");
            console.log("varify", req.body);
            const { otp } = req.body
            const variefyOtp = req.session.OTP
            console.log("v", variefyOtp);
            if (otp === variefyOtp) {
                res.json({ success: true, message: 'OTP sent successfully' });
                console.log("sucess");
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.json({ success: false, message: 'Failed to send OTP' });
        }
    },

    postlogin: async (req, res) => {
        const { username, password } = req.body;
        req.session.errorm = {};

        try {
            // Validate input data
            if (!username || !password) {
                req.session.errorm.loginError = 'Username and password are required';
                return res.redirect('/login');
            }

            // Find the user by username
            const checkUser = await User.findOne({ username });

            if (checkUser && await bcrypt.compare(password, checkUser.password)) {
                // Check if the user is blocked or an admin
                if (checkUser.role === "admin" || checkUser.block) {
                    req.session.user = checkUser;
                    return res.redirect('/admin');
                } else {
                    req.session.user = checkUser;
                    console.log("user in sessino", req.session.user);
                    req.session.isAuth = true;
                    if (req.session.prepage) {
                        return res.redirect(req.session.prepage);
                    }
                    return res.redirect('/product');
                }
            } else {
                req.session.errorm.loginError = 'Invalid username or password';
                return res.redirect('/login');
            }
        } catch (error) {
            console.error("Login error:", error);
            req.session.errorm.globalError = "An error occurred during login.";
            return res.redirect('/login');
        }
    },

    // cart
    // aggregate

    getCart: async (req, res) => {

        console.log("Fetching cart...");
        try {
            const { productId } = req.body
            // Ensure req.session.user contains a valid userId
            const userId = req.session.user._id;

            console.log(userId);

            // Convert userId to ObjectId


            // Perform an aggregation to join cart items with the products collection
            const cart = await carts.aggregate([
                // Match the cart by userId
                { $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId) } },
                // Unwind the products array to process each product individually
                { $unwind: "$products" },
                // Lookup to join with the addproducts collection
                {
                    $lookup: {
                        from: 'addproducts', // Collection name
                        localField: 'products.productId',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                // Unwind the productDetails array to process each product detail
                { $unwind: "$productDetails" },
                // Group the results to reassemble the products array
                {
                    $group: {
                        _id: "$_id",
                        userId: { $first: "$userId" },
                        products: {
                            $push: {
                                productId: "$productDetails._id",
                                productName: "$productDetails.productName",
                                Stock:"$productDetails.Stock",
                                price: "$productDetails.price",
                                picture: "$productDetails.picture",
                                quantity: "$products.quantity",
                                createdAt: "$products.craetedAt"
                            }
                        }
                    }
                }
            ]);
            // to find total price of the product

            //  const toatalProduct = await carts.find({  userId: userId,'products.productId': productId });
            //    console.log("tp",toatalProduct.products);
            const price = [];
            let totalCartPrice;
            let productCount;
            if (cart[0] && cart[0].products) {
                for (let item of cart[0].products) {
                    let itemQuantity = item.quantity;
                    console.log("Quantity:", itemQuantity);
                    let itemPrice = item.price;
                    const totalPrice = itemQuantity * itemPrice;
                    price.push(totalPrice);
                }
                console.log("Individual prices:", price);
                totalCartPrice = price.reduce((acc, currentPrice) => acc + currentPrice, 0);
                console.log("Total Price:", totalCartPrice);

                productCount = cart[0].products.reduce((acc, item) => acc + item.quantity, 0);
                console.log("Total Product Count:", productCount);
            } else {
                console.log("No products found in the cart.");
            }
            const Authentication = req.session.isAuth
            console.log('carttt', cart);
            res.render('cart', { Cart: cart[0].products, Authentication, totalCartPrice, productCount });
        } catch (error) {
            console.log('Error fetching cart:', error.message);
            res.status(500).send('Error retrieving cart');
        }
    },
    // post cart
    postcart: async (req, res) => {
        try {
            console.log("post cart", req.session.user);
            const userId = req.session.user._id;
            console.log("req", req.params.id);
            const { quantity } = req.body;
            // Get product id 
            const productId = req.params.id;
            console.log(req.body);
            console.log("q", quantity);
            console.log("product id", productId);
            let cartExits = await carts.findOne({ userId: userId });
            if (!cartExits) {
                cartExits = new carts({ userId: userId, products: [] });
                console.log(cartExits);
            }
            // Find product
            const productexist = await carts.findOne({ userId: userId, 'products.productId': productId });
            console.log("exit", productexist);
            if (productexist) {
                console.log("product already exist");
                return res.send("product already exists");
            }
            // Add to cart
            cartExits.products.push({ productId: productId, quantity: quantity });
            await cartExits.save();
            console.log("my cart", cartExits);
            res.redirect('/Cart')
        } catch (error) {
            console.log(error.message);
        }
    },
    //fetchQuanty
    fetchQuanty: async (req, res) => {
        try {
            console.log("req body", req.body);
            const { productId } = req.body
            const { quantity } = req.body
            console.log("q", quantity);
            const userId = req.session.user._id
            console.log(productId);
            console.log("update quantity");
            // increase quantity feild
            const user = await carts.find({ userId: userId });
            console.log(user);
            const updateQ = await carts.updateOne(
                { userId: userId, "products.productId": productId },
                { $set: { "products.$.quantity": quantity } }
            );
            res.json({ success: true, message: 'Quantity updated' });
            console.log("up", updateQ);
        } catch (error) {
            console.log(error.message);
        }
    },
    // remove prooduct from cart
    removeCart: async (req, res) => {
        try {
            const { productId } = req.body;
            console.log("productid", productId);
            const userId = req.session.user._id;
            let removeP = await carts.findOne({ userId: userId, "products.productId": productId }
            );
            console.log('remoed', removeP);
            if (removeP) {
                removeP.products.pull({ productId: productId });
                // console.log(removed);
                await removeP.save();
                res.json({ success: true, message: "product removed successfull" });
                res.redirect('/Cart');
            }
            else {
                console.log('product not found');
            }
        } catch (error) {
            console.log(error.message);
        }

    },
    // get wishlist
    // getWishlist:async(req,res)=>{
    //     try{
    //         const userId=req.session.user._id;
    //         const cart = await carts.findOne({ userId :userId})
    //         res.render('add-to-wishlist',{cart})
    //         }catch(error){
    //         console.log(error.message);
    //     }

    // },
    //wishlist_post
    postwishlist: async (req, res) => {
        try {
            const userId = req.session.user._id
            console.log(userId);
            console.log("wish req", req.body);
            const { productId } = req.body;
            let wishlists = await wishlist.findOne({ userId: userId });
            console.log("already", wishlists);
            if (!wishlists) {
                wishlists = new wishlist({ userId: userId, products: [] });
                console.log("new", wishlists);
            }
            const productexist = await wishlist.findOne({ userId: userId, 'products.productId': productId });
            console.log("exit", productexist);
            if (productexist) {
                console.log("product already exist");
                return res.send("product already exists");
            }
            // Add to wishlist
            wishlists.products.push({ productId: productId });
            await wishlists.save();
            res.json({ success: true, message: 'wishlist added' });
            console.log("my cart", wishlists);
            res.redirect('/product')
        } catch (error) {
            console.log(error.message);
        }

    },

    // get wishlist

    getwishlist: async (req, res) => {

        const userId = req.session.user._id;

        console.log("wuser",userId);

        // Convert userId to ObjectId


        // Perform an aggregation to join cart items with the products collection
        const wishlists = await wishlist.aggregate([
            // Match the cart by userId
            { $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId) } },
            // Unwind the products array to process each product individually
            { $unwind: "$products" },
            // Lookup to join with the addproducts collection
            {
                $lookup: {
                    from: 'addproducts', // Collection name
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            // Unwind the productDetails array to process each product detail
            { $unwind: "$productDetails" },
            // Group the results to reassemble the products array
            {
                
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    products: {
                        $push: {
                            productId: "$productDetails._id",
                            productName: "$productDetails.productName",
                            Stock:"$productDetails.Stock",
                            price: "$productDetails.price",
                            picture: "$productDetails.picture",
                            quantity: "$products.quantity",
                            createdAt: "$products.craetedAt"
                        }
                    }
                }
            
            }
        ]);
        console.log("www",wishlists);
        const Authentication = req.session.isAuth
        console.log("rreached", wishlists[0]);
        res.render('add-to-wishlist', { wishlist: wishlists[0].products,Authentication})

    
},
// wishlist quantity
 WishlistQuanty: async (req, res) => {
    try {
        console.log("req body", req.body);
        const { productId } = req.body
        const { quantity } = req.body
        console.log("q", quantity);
        const userId = req.session.user._id
        console.log(productId);
        console.log("update quantity");
        // increase quantity feild
        const user = await wishlist.find({ userId: userId });
        console.log(user);
        const updateQ = await wishlist.updateOne(
            { userId: userId, "products.productId": productId },
            { $set: { "products.$.quantity": quantity } }
        );
        res.json({ success: true, message: 'Quantity updated' });
        console.log("up", updateQ);
    } catch (error) {
        console.log(error.message);
    }
},
// remove from wishlist
removeWishlist: async (req, res) => {
    try {
        const { productId } = req.body;
        console.log("productid", productId);
        const userId = req.session.user._id;
        let removeP = await wishlist.findOne({ userId: userId, "products.productId": productId }
        );
        console.log('remoed', removeP);
        if (removeP) {
            removeP.products.pull({ productId: productId });
            // console.log(removed);
            await removeP.save();
            res.json({ success: true, message: "product removed successfull" });
            res.redirect('/Cart');
        }
        else {
            console.log('product not found');
        }
    } catch (error) {
        console.log(error.message);
    }

},
getBuyNow:async(req,res)=>{
   
  res.render('checkout')
},
}

