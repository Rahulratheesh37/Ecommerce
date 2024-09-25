
const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    street:String,
    city:String,
    state:String,
    zip:String,
    country:String,
    landmark:String,
    mobile:Number,
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref:'user' }],
    
})
const Addresses= mongoose.model('Addresses', AddressSchema);
module.exports = Addresses;