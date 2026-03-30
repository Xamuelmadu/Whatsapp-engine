const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({

  merchant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant"
  },

  store_name: String,

  whatsapp_number: String,

  industry: {
    type: String,
    default: "ecommerce"
  },

  checkout_options: {

    website: Boolean,
    whatsapp: Boolean,
    bank_transfer: Boolean

  },

  bank_details: {

    bank: String,
    account_name: String,
    account_number: String

  },

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Store", StoreSchema);