const mongoose = require("mongoose");

const IntegrationSchema = new mongoose.Schema({

  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },

  type: String,

  api_key: String,

  api_secret: String,

  store_url: String

});

module.exports = mongoose.model("Integration", IntegrationSchema);