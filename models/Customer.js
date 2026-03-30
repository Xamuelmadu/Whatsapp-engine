const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({

  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },

  phone: String,

  name: String,

  preferred_size: String,

  address: String,

  purchase_history: [

    {
      product_name: String,
      price: Number,
      date: Date
    }

  ],

  last_interaction: Date

});

module.exports = mongoose.model("Customer", CustomerSchema);