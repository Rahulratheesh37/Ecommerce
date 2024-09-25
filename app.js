const express = require('express')
const database = require('./database/database')
const controller = require('./Routes/userRoutes')
const Admincontroller = require('./Routes/AdminRoutes')
// const ProductController =require('./Routes/updateSubCategoryRoutes')
// const multer = require('multer')
const app = express();
//endotenvv
// require('dotenv/config')
// const Api=process.env.API_URL;

const subCategoryModel = require('./model/subCategory')

const session = require('express-session');

const path = require('path');
// const sellercontroller = require('./controllers/sellercontroller')
// const Sellerroute = require('./Routes/sellerRouter')
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use("/", controller)
app.use('/', Admincontroller);
// app.use('/', UpdateController)

app.get('/GetSubCategory/:id',async(req,res)=>{
  const id = req.params.id
  const subcategory = await subCategoryModel.find({CategoryId:id})

  console.log("reached"+subcategory);

  res.json(subcategory)
})
const port = 1000;
app.listen(port, () => {
  // console.log(Api);
  console.log(`server started http://localhost:1000/product`);
});