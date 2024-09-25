const mongoose=require('mongoose')



const addproductschema = new mongoose.Schema({
  
    productName:String,
    description:String,
    price:Number,
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'categorys'
    }, 
    SubCategory:{
     type: mongoose.Schema.Types.ObjectId,
        ref:'subcategorys'
    },
    Stock:String,
    size:Number,
    colour:String,
    picture:[ String ]
    });
  
const addproduct = mongoose.model('addproduct',addproductschema);
module.exports=addproduct;