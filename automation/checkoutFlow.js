const { getSession } = require("../services/checkoutSession");

async function handleCheckout(phone, message){

  const session = getSession(phone);

  if(session.step === "size"){
    session.data.size = message;
    session.step = "quantity";

    return "How many pairs would you like?";
  }

  if(session.step === "quantity"){
    session.data.quantity = message;
    session.step = "address";

    return "Please provide your delivery address.";
  }

  if(session.step === "address"){
    session.data.address = message;
    session.step = "confirm";

    return `
Order Summary:

Size: ${session.data.size}
Quantity: ${session.data.quantity}

Delivery Address:
${session.data.address}

Type CONFIRM to proceed with payment.
`;
  }

  return null;

}

module.exports = { handleCheckout };