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

    // =============================
    // AGENT HANDOFF CHECK
    // =============================
    const agentActive = await isAgentActive(customerNumber);

    if (agentActive) {
      console.log("Agent handling conversation for:", customerNumber);
      return;
    }

    // =============================
    // IDENTIFY MERCHANT
    // =============================
    const merchant = await getMerchantByNumber(businessPhoneId);

    if (!merchant) {
      console.log("No merchant found for phone id:", businessPhoneId);
      return;
    }

    // =============================
    // GENERATE AI REPLY
    // =============================
    const reply = await generateAIReply(
      customerNumber,
      text,
      merchant
    );

    // =============================
    // SEND WHATSAPP MESSAGE
    // =============================
    console.log("Sending reply to:", customerNumber);

    await sendWhatsAppMessage(customerNumber, reply);

  } catch (error) {
    console.error("Webhook error:", error.message);
  }
}

module.exports = {
  handleIncomingMessage,
};