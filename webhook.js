const { getMerchantByNumber } = require("./services/merchantService")
const { generateAIReply } = require("./services/aiService")
const { sendWhatsAppMessage } = require("./services/whatsappService")

app.post("/webhook", async (req, res) => {

  try {

    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]

    if (!message) {
      return res.sendStatus(200)
    }

    const metadata = req.body.entry[0].changes[0].value.metadata

    const businessPhoneId = metadata.phone_number_id
    const customerNumber = message.from
    const text = message.text?.body || ""

    /*
    IDENTIFY MERCHANT
    */
    const merchant = await getMerchantByNumber(businessPhoneId)

    if (!merchant) {
      console.log("No merchant found")
      return res.sendStatus(200)
    }

    /*
    GENERATE AI RESPONSE
    */
    const reply = await generateAIReply(
      customerNumber,
      text,
      merchant
    )

    /*
    SEND MESSAGE
    */
    await sendWhatsAppMessage(customerNumber, reply)

    res.sendStatus(200)

  } catch (error) {

    console.error("Webhook error:", error)

    res.sendStatus(200) // VERY IMPORTANT
  }

})