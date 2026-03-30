async function nextState(currentState){

  switch(currentState){

    case "greeting":
      return "discovery"

    case "discovery":
      return "recommendation"

    case "recommendation":
      return "order_confirmation"

    case "order_confirmation":
      return "checkout"

    case "checkout":
      return "payment"

    default:
      return "discovery"

  }

}

module.exports = { nextState }