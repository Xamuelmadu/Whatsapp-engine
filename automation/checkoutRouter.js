const clients = require("../clients/clientConfig");

function getCheckoutOptions(phone){

  const client = clients[phone];

  const options = [];

  if(client.checkoutOptions.website){
    options.push("1️⃣ Checkout on the website");
  }

  if(client.checkoutOptions.whatsapp){
    options.push("2️⃣ Checkout here in WhatsApp");
  }

  if(client.checkoutOptions.bankTransfer){
    options.push("3️⃣ Pay via bank transfer");
  }

  return `
How would you like to complete your order?

${options.join("\n")}
`;

}

module.exports = { getCheckoutOptions };