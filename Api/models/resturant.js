const mongoose = require("mongoose");

const resturantSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  foodType: String,
  intro: {
    type: String,
  },
  post_code: {
    type: String,
    required: true,
  },
  cover_image: String,
  foods: [String],
  email: {
    type: String,
    required: true,
  },
  password: String,
  pending_orders: [String],
  confirmed_orders: [String],
  pickup_orders: [String],
  cancelled_orders: [String],
  bank_account: {
    sortCode: {
      type: Number,
      validate: {
        validator: function(val) {
            return val.toString().length === 6 
        },
        message: val => `${val.value} has to be 6 digits`
      },
      default: 000000
    },
    accountNumber: {
      type: Number,
      validate: {
        validator: function(val) {
            return val.toString().length === 8 
        },
        message: val => `${val.value} has to be 8 digits`
      },
      default: 00000000
    },
    accountHolderName: {
      type: String,
      default: "Account Holder Name"
    },
    bankName: {
      type: String,
      default: "Account Holder Name"
    }
  },
  total_sale: {
    type: Number,
    default: 0,
  },
  current_balance: {
    type: Number,
    default: 0,
  },
  last_invoice: {
    date: Date,
    amount: Number,
  },
  categories: [String],
  open_status: {
    type: Boolean,
    default: true,
  },
  business_hour: {
    open: String,
    close: String,
  },
  contact_number: String,
  on_board: {
    type: Boolean,
    default: false,
  },
  admin_issued: {
    type: Boolean,
    default: false,
  },
  member_since: Date,
  added_at: Number,
  banned: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  // chefName: {
  //   type: String,
  // },
  // chefBio: {
  //   type: String,
  // },
  // chefImage: {
  //   type: String,
  // },
  chefs: [String],
  verified: {
    type: Boolean,
    default: false,
  },
  resetCode: Number,
  passwordReset: {
    type: Boolean,
    default: false,
  },
  // });

  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
});

resturantSchema.index({ location: '2dsphere' });
module.exports = mongoose.model("Resturant", resturantSchema);
