const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({

  phone:String,
  name:String,
  service:String,
  budget:String,
  status:{
    type:String,
    default:"new"
  }

});

module.exports = mongoose.model("Lead", LeadSchema);