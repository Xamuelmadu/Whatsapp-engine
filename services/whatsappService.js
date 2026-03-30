const axios = require("axios");

async function sendProductCard(to, product){

  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "image",
      image: {
        link: product.images[0],
        caption: `
${product.name}

${product.description.substring(0,120)}...

Price: $${product.price}

Would you like to order this product?
`
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

}

module.exports = { sendProductCard };