const mongoose = require("mongoose");

const AgentSessionSchema = new mongoose.Schema({

  phone: String,

  active: Boolean,

  started_at: Date

});

module.exports = mongoose.model("AgentSession", AgentSessionSchema);