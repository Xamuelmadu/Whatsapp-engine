const { searchProducts } = require("../services/productService");
const { sendProductRecommendations } = require("../services/productCardSender");

async function ecommerceHandler(phone, message){

  const products = await searchProducts(message);

  if(products.length){

    await sendProductRecommendations(phone, products);

    return `
Which of these would you like to order?

You can reply with the product name.
`;

  }

  return null;

}

module.exports = { ecommerceHandler };