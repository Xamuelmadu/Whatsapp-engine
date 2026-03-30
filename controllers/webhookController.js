const { getMerchantByNumber } = require("../services/merchantService")
const { generateAIReply } = require("../services/aiService")
const { sendWhatsAppMessage } = require("../services/whatsappService")
const { isAgentActive } = require("../services/agentService")



async function handleIncomingMessage(req,res){

  try{

    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]

    if(!message){
      return res.sendStatus(200)
    }

    const metadata = req.body.entry[0].changes[0].value.metadata

    const businessPhoneId = metadata.phone_number_id
    const customerNumber = message.from
    const text = message.text?.body || ""


    /*
    Check if human agent has taken over conversation
    */

    const agentActive = await isAgentActive(customerNumber)

    if(agentActive){

      console.log("Agent handling conversation for:",customerNumber)

      return res.sendStatus(200)

    }



    /*
    Identify merchant store
    */

    const merchant = await getMerchantByNumber(businessPhoneId)

    if(!merchant){

      console.log("No merchant found for phone id:",businessPhoneId)

      return res.sendStatus(200)

    }



    /*
    Generate AI reply using merchant context
    */

    const reply = await generateAIReply(

      customerNumber,
      text,
      merchant

    )



    /*
    Send WhatsApp reply
    */

    await sendWhatsAppMessage(customerNumber,reply)



    res.sendStatus(200)

  }catch(error){

    console.error("Webhook error:",error)

    res.sendStatus(200)

  }

}



module.exports = {

  handleIncomingMessage

}