const Customer = require("../models/Customer");

async function getCustomer(phone){

  let customer = await Customer.findOne({ phone });

  if(!customer){

    customer = await Customer.create({
      phone: phone,
      last_interaction: new Date()
    });

  }

  return customer;

}

async function updateCustomer(phone, data){

  await Customer.findOneAndUpdate(
    { phone },
    data
  );

}

module.exports = {
  getCustomer,
  updateCustomer
};