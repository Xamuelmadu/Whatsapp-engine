const axios = require("axios");

async function sendWhatsAppMessage(to, text) {
  try {
    // Strip all whitespace (including hidden \r, \n, \t) from env vars
    const PHONE_NUMBER_ID = (process.env.PHONE_NUMBER_ID || "").replace(/\s/g, "");
    const WHATSAPP_TOKEN = (process.env.WHATSAPP_TOKEN || "").replace(/\s/g, "");

    // ── Validate PHONE_NUMBER_ID ──────────────────────────────────────────────
    if (!PHONE_NUMBER_ID) {
      throw new Error("PHONE_NUMBER_ID is missing or empty");
    }

    if (!/^\d+$/.test(PHONE_NUMBER_ID)) {
      console.error(
        "❌ PHONE_NUMBER_ID contains non-numeric characters. Raw value (hex):",
        Buffer.from(process.env.PHONE_NUMBER_ID || "").toString("hex")
      );
      throw new Error(
        `PHONE_NUMBER_ID must be numeric only — got: "${PHONE_NUMBER_ID}"`
      );
    }

    // ── Validate WHATSAPP_TOKEN ───────────────────────────────────────────────
    if (!WHATSAPP_TOKEN) {
      throw new Error("WHATSAPP_TOKEN is missing or empty");
    }

    // ── Build & validate URL ──────────────────────────────────────────────────
    const url = `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`;

    try {
      new URL(url); // throws if the URL is malformed
    } catch (urlError) {
      console.error("❌ Constructed URL is invalid:", url);
      throw new Error(`Invalid URL constructed: ${url} — ${urlError.message}`);
    }

    console.log("📡 Sending to URL:", url);
    console.log("📞 PHONE_NUMBER_ID length:", PHONE_NUMBER_ID.length, "| value:", PHONE_NUMBER_ID);
    console.log("🔑 WHATSAPP_TOKEN length:", WHATSAPP_TOKEN.length, "| starts with:", WHATSAPP_TOKEN.slice(0, 6) + "...");

    // ── Send request ──────────────────────────────────────────────────────────
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
    // Log the full axios error details, not just the message
    if (error.response) {
      console.error("❌ sendWhatsAppMessage — HTTP error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error("❌ sendWhatsAppMessage — No response received:", {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method
        }
      });
    } else {
      console.error("❌ sendWhatsAppMessage — Setup error:", error.message);
    }
  }
}

module.exports = { sendWhatsAppMessage };