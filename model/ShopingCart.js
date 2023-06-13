const mongoose = require('mongoose');

// Define the ShoppingCart schema
const ShoppingCartSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  items: [
    {
      productId: {
        type: String,
        required: true
      },

      productName: {
        type: String,
        required: true
      },

     productPrice: {
       type: Number,
       required: true
     },

     productImage: {
       type: String,
       required: true
     },
     quantity: {
        type: Number,
        required: true
     }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the ShoppingCart model
const ShoppingCart = mongoose.model('ShoppingCart', ShoppingCartSchema);