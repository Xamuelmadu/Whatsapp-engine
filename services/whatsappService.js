const axios = require("axios");

async function sendProductCard(to, product) {
  try {
    const PHONE_NUMBER_ID = (process.env.PHONE_NUMBER_ID || "").trim();
    const WHATSAPP_TOKEN = (process.env.WHATSAPP_TOKEN || "").trim();

    // ✅ Strong validation (fixes Invalid URL fully)
    if (!PHONE_NUMBER_ID || !/^\d+$/.test(PHONE_NUMBER_ID)) {
      throw new Error(`Invalid PHONE_NUMBER_ID: "${PHONE_NUMBER_ID}"`);
    }

    if (!WHATSAPP_TOKEN) {
      throw new Error("WHATSAPP_TOKEN is missing");
    }

    const url = `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`;

    console.log("📡 Sending to URL:", url);

    // ✅ Safe product fields
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
        to: String(to).replace("+", ""), // ✅ normalize number
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