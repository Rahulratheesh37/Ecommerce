// const express = require('express');
// const User = require('../model/User')
// const categorys = require('../model/category');
// const subcategorys = require('../model/subCategory')
// const addproduct = require('../model/Product');
// const multer = require('../util/multer')
// const fs = require('fs')    

// const controller = require('../controllers/AdminController');

// const ProductRoute = express.Router();
// //multer : add images

// const multer = require('../util/multer')
// //env
// require('dotenv/config')
// const Api=process.env.API_URL;

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/AddPictures');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + (file.originalname));
//   }
// });

// const multer = require('../util/multer')
// const upload = multer({ storage: storage })


// ProductRoute.get('/addproduct', controller.getaddproduct)
//   .get('/product-detail', controller.getproductdetails)

//   .get('/UpdateProduct/:id', controller.getUpdateProduct)
//   .post('/UpdateProduct/:id', upload.single('picture'), controller.postUpadateProduct)
//   .get('/deleteProduct/:id',controller.getDeleteProduct)
  

//   module.exports=ProductRoute
