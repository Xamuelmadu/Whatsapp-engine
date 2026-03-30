const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({

  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },

  phone: String,

  messages: [

    {
      role: String,
      content: String,
      timestamp: Date
    }

  ]

});

module.exports = mongoose.model("Conversation", ConversationSchema);