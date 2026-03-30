const axios = require("axios");

async function createPaymentLink(amount, email){

  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email: email,
      amount: amount * 100
    },
    {
      headers:{
        Authorization:`Bearer ${process.env.PAYSTACK_SECRET}`
      }
    }
  );

  return response.data.data.authorization_url;
}

module.exports = { createPaymentLink };