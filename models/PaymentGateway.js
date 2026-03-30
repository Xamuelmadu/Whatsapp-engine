const mongoose = require("mongoose");

const PaymentGatewaySchema = new mongoose.Schema({

  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },

  provider: String,

  public_key: String,

  secret_key: String,

  currency: String

});

module.exports = mongoose.model("PaymentGateway", PaymentGatewaySchema);