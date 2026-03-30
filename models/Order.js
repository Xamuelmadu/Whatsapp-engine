const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },

  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  },

  product_name: String,

  price: Number,

  quantity: Number,

  size: String,

  address: String,

  payment_method: String,

  status: {
    type: String,
    default: "pending"
  },

  payment_link: String,

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", OrderSchema);