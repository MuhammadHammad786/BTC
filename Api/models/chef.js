const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    chefName: {
        type:String,
        required: true
    },
    chefImage: {
      type: String  
    },
    chefBio:{
        type:String
    },
    addedAt:Date
});

module.exports = mongoose.model('Chef', chefSchema);