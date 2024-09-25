const mongoose = require('mongoose');
// const Category = require('./category');

const SubCategorySchema = new mongoose.Schema({
  SubCategorie : {
    type: String,
    required: true,
  
  },
  CategoryId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'category'
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const subcategorys = mongoose.model('subcategorys', SubCategorySchema);

module.exports = subcategorys;
