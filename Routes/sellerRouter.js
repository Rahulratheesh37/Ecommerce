// const express = require('express');
// const multer=require('multer')
// const controller = require('../controllers/sellercontroller');
// const Sellerroute = express.Router();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, '/AddPictures'); 
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() +(file.originalname)); 
//     }
//   });
//   const upload=multer({storage:storage})

// Sellerroute.get('/addproduct',controller.getaddproduct)
// module.exports=Sellerroute;