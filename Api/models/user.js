const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    phone: String,
    profileImage:String,
    location: String,
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    orders:[String],
    role:[String],
    verified:{
        type:Boolean,
        default: false
    },
    banned:{
        type: Boolean,
        default: false
    },
    resetCode: Number,
    passwordReset:{
        type: Boolean,
        default: false
    },
    isActive:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('User', userSchema);