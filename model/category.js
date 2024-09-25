const mongoose = require('mongoose');

// Assuming you have a SubCategory model defined somewhere


const CategoryShema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
 
});

const categorys = mongoose.model('categorys',CategoryShema );

module.exports = categorys;
