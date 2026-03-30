const { getMerchantByNumber } = require("./services/merchantService")

app.post("/webhook", async(req,res)=>{

  const message = req.body.entry[0].changes[0].value.messages[0]

  const businessNumber = message.to
  const customerNumber = message.from
  const text = message.text.body

  const merchant = await getMerchantByNumber(businessNumber)

  if(!merchant){
    return res.sendStatus(200)
  }

  // load merchant products

  const reply = await generateAIReply(
    customerNumber,
    text,
    merchant
  )

  await sendWhatsAppMessage(customerNumber, reply)

  res.sendStatus(200)

})