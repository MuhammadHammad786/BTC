const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type:String,
        required: true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required: true
    },
    offer:{
        type:Number,
        default: 0
    },
    sale:{
        type:Number,
        default: 0
    },
    resturant:{
        type: String,
        required: true
    },
    images:[String],
    addedAt:Date
});

module.exports = mongoose.model('Food', foodSchema);