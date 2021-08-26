const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    resturant:{
        type:String,
        required: true
    },
    foods:[{
            itemId:String,
            quantity: Number,
            price: Number,
            image: String,
            title: String

        }],
    sub_total:Number,
    total: Number,
    pickup_time:String,
    contact_number: String,
    user:{
        type:String,
        required: true
    },
    paid:{
       type: Boolean,
       default: false
    },
    cardId: String,
    picked:{
        type:Boolean,
        default: false
    },
    pending:{
        type: Boolean,
        default: true
    },
    accepted:{
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model('Order', orderSchema);