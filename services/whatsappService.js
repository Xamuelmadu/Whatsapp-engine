const axios = require("axios");

async function sendWhatsAppMessage(to, text) {
  try {
    const PHONE_NUMBER_ID = (process.env.PHONE_NUMBER_ID || "").trim();
    const WHATSAPP_TOKEN = (process.env.WHATSAPP_TOKEN || "").trim();

    if (!PHONE_NUMBER_ID) {
      throw new Error("PHONE_NUMBER_ID missing");
    }

    if (!WHATSAPP_TOKEN) {
      throw new Error("WHATSAPP_TOKEN missing");
    }

    const url = `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`;

    console.log("📡 TEXT MESSAGE URL:", url);

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: String(to).replace("+", ""),
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Text message sent to:", to);

  } catch (error) {
    console.error(
      "❌ sendWhatsAppMessage error:",
      error.response?.data || error.message
    );
  }
}

module.exports = { sendWhatsAppMessage };