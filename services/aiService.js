const OpenAI = require("openai")

const {
  getConversation,
  saveMessage,
  updateConversationState
} = require("./conversationService")

const { getCustomer } = require("./customerService")
const { getStoreProducts } = require("./productService")
const { nextState } = require("./salesStateService")

const {
  hasVariations,
  getMissingAttributes,
  findVariant,
  buildVariationQuestion
} = require("./variationService")

const { enforceSubscription } = require("./subscriptionGuard")
const { checkRateLimit } = require("./rateLimitService")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
})


/*
--------------------------------
ATTRIBUTE PARSER
--------------------------------
*/

function parseAttributesFromMessage(message){

  const attributes = {}

  const text = message.toLowerCase()

  const sizes = ["36","37","38","39","40","41","42","43","44","45"]
  const colors = ["black","white","red","blue","green"]

  sizes.forEach(s=>{
    if(text.includes(s)) attributes.size = s
  })

  colors.forEach(c=>{
    if(text.includes(c)) attributes.color = c
  })

  return attributes
}



/*
--------------------------------
COSINE SIMILARITY
--------------------------------
*/

function cosineSimilarity(a,b){

  const dot = a.reduce((sum,val,i)=>sum+val*b[i],0)
  const magA = Math.sqrt(a.reduce((sum,val)=>sum+val*val,0))
  const magB = Math.sqrt(b.reduce((sum,val)=>sum+val*val,0))

  return dot/(magA*magB)
}



/*
--------------------------------
SEMANTIC PRODUCT SEARCH
--------------------------------
*/

async function semanticProductSearch(products,message){

  const embedding = await openai.embeddings.create({
    model:"text-embedding-3-small",
    input:message
  })

  const queryVector = embedding.data[0].embedding

  const scored = products.map(p=>{

    if(!p.embedding){
      return {product:p,score:0}
    }

    const score = cosineSimilarity(queryVector,p.embedding)

    return {product:p,score}

  })

  scored.sort((a,b)=>b.score-a.score)

  return scored.slice(0,3).map(s=>s.product)
}



async function generateAIReply(phone, message, merchant){

  await enforceSubscription(merchant._id)

  /*
  RATE LIMIT
  */

  if(!checkRateLimit(phone)){
    return "Please slow down a bit. I'm still helping you 😊"
  }

  try{

    /*
    LOAD CONVERSATION
    */

    const convo = await getConversation(phone)

    const history = convo?.messages?.slice(-6) || []
    const state = convo?.state || "greeting"

    const selectedProduct = convo?.selectedProduct || null
    const pendingAttributes = convo?.pendingAttributes || null


    /*
    LOAD CUSTOMER PROFILE
    */

    const customer = await getCustomer(phone)


    /*
    LOAD PRODUCTS
    */

    const products = await getStoreProducts(merchant._id)



    /*
    PARSE ATTRIBUTES
    */

    const attributes = parseAttributesFromMessage(message)



    /*
    --------------------------------
    RESOLVE PENDING ATTRIBUTES
    --------------------------------
    */

    if(selectedProduct){

      const variant = findVariant(selectedProduct, attributes)

      if(variant){

        const reply = `
${selectedProduct.name} (${Object.values(variant.attributes).join(" / ")}) costs ₦${variant.price}.

Would you like to order this now?
`

        await saveMessage(phone,"user",message)
        await saveMessage(phone,"assistant",reply)

        await updateConversationState(phone,{
          selectedProduct:null,
          pendingAttributes:null
        })

        return reply
      }

    }



    /*
    --------------------------------
    SEMANTIC PRODUCT SEARCH
    --------------------------------
    */

    const searchResults = await semanticProductSearch(products,message)

    const matchedProduct = searchResults[0]



    /*
    --------------------------------
    VARIATION LOGIC
    --------------------------------
    */

    if(matchedProduct){

      if(hasVariations(matchedProduct)){

        const variant = findVariant(matchedProduct, attributes)

        if(variant){

          const reply = `
${matchedProduct.name} (${Object.values(variant.attributes).join(" / ")}) costs ₦${variant.price}.

Would you like to order this now?
`

          await saveMessage(phone,"user",message)
          await saveMessage(phone,"assistant",reply)

          await updateConversationState(phone,{
            selectedProduct:matchedProduct,
            pendingAttributes:null
          })

          return reply
        }


        const missing = getMissingAttributes(matchedProduct, attributes)

        if(missing.length){

          const reply = `
${matchedProduct.name} is available with multiple options.

${buildVariationQuestion(matchedProduct)}

Which ${missing.join(" and ")} would you like?
`

          await saveMessage(phone,"user",message)
          await saveMessage(phone,"assistant",reply)

          await updateConversationState(phone,{
            selectedProduct:matchedProduct,
            pendingAttributes:missing
          })

          return reply
        }

      }


      /*
      SIMPLE PRODUCT
      */

      const reply = `
${matchedProduct.name} costs ₦${matchedProduct.price}.

Would you like to order now?
`

      await saveMessage(phone,"user",message)
      await saveMessage(phone,"assistant",reply)

      return reply
    }



    /*
    --------------------------------
    BUILD PRODUCT CONTEXT FOR AI
    --------------------------------
    */

    const productContext = products
      .slice(0,10)
      .map(p => `
${p.name}
Price: ₦${p.price}
Category: ${p.category || "General"}
`)
      .join("\n")



    /*
    BUILD SYSTEM PROMPT
    */

    const systemPrompt = `

You are the AI sales assistant for ${merchant.name}.

Your job is to help customers discover products and complete purchases through WhatsApp.

Rules:

• Be friendly and conversational
• Keep responses under 3 sentences
• Ask helpful questions
• Recommend products ONLY from the catalog
• Never invent products
• Guide the customer toward completing a purchase

Conversation stage: ${state}

Customer profile:

Name: ${customer?.name || "Unknown"}
Preferred Size: ${customer?.preferred_size || "Unknown"}
Address: ${customer?.address || "Unknown"}

Available products:

${productContext}

Payment options:

1. Pay on WhatsApp
2. Checkout on website
3. Bank transfer

`



    /*
    BUILD MESSAGE STACK
    */

    const messages = [

      { role:"system",content:systemPrompt },

      ...history,

      { role:"user",content:message }

    ]



    /*
    OPENAI REQUEST
    */

    const completion = await openai.chat.completions.create({

      model:"gpt-4.1-mini",
      temperature:0.4,
      max_tokens:150,
      messages

    })



    const reply = completion.choices[0].message.content



    /*
    SAVE CONVERSATION
    */

    await saveMessage(phone,"user",message)
    await saveMessage(phone,"assistant",reply)



    /*
    UPDATE SALES STATE
    */

    const newState = await nextState(state,message)

    await updateConversationState(phone,newState)



    return reply

  }
  catch(error){

    console.error("AI generation error:",error)

    return "Sorry, something went wrong. Please try again."

  }

}


module.exports = {
  generateAIReply
}