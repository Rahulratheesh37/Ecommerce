const express = require('express');
const controller = require('../controllers/AdminController');
const Adminroute = express.Router();
const multer = require('../util/multer')
//env
require('dotenv/config')
const Api=process.env.API_URL;







const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/AddPictures');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + (file.originalname));
  }
});

const upload = multer({ storage: storage })

Adminroute.get(Api+'/addproduct', controller.getaddproduct)

Adminroute.get('/admin', controller.getAdmin)
  .post('/addproduct', upload.array('picture',7), controller.postaddproduct)
  .post('/admin',controller.postadmin) 

  .get('/addproduct', controller.getaddproduct)
  .post('/postaddproduct',controller.postaddproduct)
  .get('/product-detail', controller.getproductdetails)

  // product
  .get('/UpdateProduct/:id', controller.getUpdateProduct)
  .post('/UpdateProduct/:id', upload.array('picture',7), controller.postUpadateProduct)
  .get('/deleteProduct/:id',controller.getDeleteProduct)

//  //userBlock
  .get('/BlockUser/:id',controller.getBlockUser)
  .get('/UnBlockUser/:id',controller.getUnBlockUser)
 
  // category
  .get('/addCategory',controller.getaddCategory)
  .post('/addCategory',controller.PostaddCategory)
  .get('/UpdateCategory/:id',controller.getUpdateCategory)
  .post('/UpdateCategory/:id',controller.postUpdateCategory)
  .get('/deleteCategory/:id',controller.getDeleteCategory)
// Sub Category
  .get('/addSubCategory',controller.getaddSubCategory)
  .post('/addSubCategory',controller.PostaddSubCategory)
  .get('/UpdateSubCategory/:id',controller.getUpdateSubCategory)
  .post('/UpdateSubCategory/:id',controller.postUpdateSubCategory)
  .get('/DeleteSubCategory/:id',controller.getDeleteSubCategory)


   
       

module.exports = Adminroute;


