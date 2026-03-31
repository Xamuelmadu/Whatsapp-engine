const { getMerchantByNumber } = require("../services/merchantService");
const { generateAIReply } = require("../services/aiService");
const { sendWhatsAppMessage } = require("../services/whatsappService");
const { isAgentActive } = require("../services/agentService");

async function handleIncomingMessage(message, metadata) {
  try {
    if (!message) return;

    const businessPhoneId = metadata?.phone_number_id;
    const customerNumber = message.from;
    const text = message.text?.body || "";

    console.log("📩 Incoming from:", customerNumber, "| Message:", text);

    // =============================
    // AGENT STATUS (NO BLOCKING)
    // =============================
    const agentActive = await isAgentActive(customerNumber);

    if (agentActive) {
      console.log("👤 Agent is monitoring conversation:", customerNumber);
      // ⚠️ DO NOT RETURN — AI still runs
    }

    // =============================
    // IDENTIFY MERCHANT
    // =============================
    const merchant = await getMerchantByNumber(businessPhoneId);

    if (!merchant) {
      console.log("❌ No merchant found for phone id:", businessPhoneId);
      return;
    }

    // =============================
    // GENERATE AI REPLY
    // =============================
    console.log("🤖 Generating AI reply...");

    const reply = await generateAIReply(
      customerNumber,
      text,
      merchant
    );

    if (!reply) {
      console.log("⚠️ AI returned empty response");
      return;
    }

    console.log("🧠 AI Reply:", reply);

    // =============================
    // SEND WHATSAPP MESSAGE
    // =============================
    console.log("📤 Sending reply to:", customerNumber);

    await sendWhatsAppMessage(customerNumber, reply);

    console.log("✅ Reply sent");

  } catch (error) {
    console.error("❌ Webhook error:", error.message);
  }
}

module.exports = {
  handleIncomingMessage,
};