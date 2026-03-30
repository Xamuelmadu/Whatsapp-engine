const clients = require("../clients/clientConfig");
const { activateAgent } = require("../services/agentService");

async function handleCheckoutSelection(phone, message, product){

  const client = clients[phone];

  if(message === "3"){

    await activateAgent(phone);

    return `
You can complete payment via bank transfer.

Bank: ${client.bankDetails.bank}
Account Name: ${client.bankDetails.accountName}
Account Number: ${client.bankDetails.accountNumber}

Once you have made the transfer, please send the payment receipt here.

I will now transfer you to one of our agents to confirm your order.
`;

  }

}

module.exports = { handleCheckoutSelection };