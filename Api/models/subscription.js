const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
     email:{
         type:String,
         required: true
     }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);