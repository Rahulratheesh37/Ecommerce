
const mongoose = require('mongoose');
// const dotenv=require('dotenv');

// dotenv.config();

// const mongoURI=process.env.MONGO_URI;

// const connectDB=async()=>{
//     try{
//         await mongoose.connect(mongoURI);
//         console.log('mongo connected');
//     }catch{
//         console.log('Canot connect with mongoDB',err);
//     }
// }
// module.exports=connectDB;

const usermodel=require('../model/User')
const userschema=require('../model/User')
// CREATE DB AND CONNECT MONGO
mongoose.connect('mongodb://localhost:27017/myweb').then(() => {
    console.log("mongo connected");
}).catch(() => {
    console.log("errror");
});

