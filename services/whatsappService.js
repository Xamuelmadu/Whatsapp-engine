const axios = require("axios");

async function sendProductCard(to, product) {
  try {
    const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

    // ✅ Validate env (prevents "Invalid URL")
    if (!PHONE_NUMBER_ID) {
      throw new Error("PHONE_NUMBER_ID is missing");
    }

    if (!WHATSAPP_TOKEN) {
      throw new Error("WHATSAPP_TOKEN is missing");
    }

    const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

    // ✅ Safe product fields (prevents crashes)
    const imageUrl = product?.images?.[0];
    const name = product?.name || "Product";
    const description = product?.description
      ? product.description.substring(0, 120)
      : "No description available";
    const price = product?.price ?? "N/A";

    if (!imageUrl) {
      throw new Error("Product image is missing");
    }

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "image",
        image: {
          link: imageUrl,
          caption: `${name}

${description}...

Price: $${price}

Would you like to order this product?`
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Product card sent to:", to);

  } catch (error) {
    console.error(
      "❌ sendProductCard error:",
      error.response?.data || error.message
    );
  }
}

module.exports = { sendProductCard };