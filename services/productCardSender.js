const { sendProductCard } = require("./whatsappService");

async function sendProductRecommendations(phone, products){

  for(const product of products){

    await sendProductCard(phone, product);

  }

}

module.exports = { sendProductRecommendations };