module.exports = {

  "2348000000000": {

    name: "Luxury Fashion Store",

    industry: "ecommerce",

    systemPrompt: `
You are an AI sales assistant for an e-commerce brand communicating with customers on WhatsApp.

Your role is to:

• Help customers discover products
• Answer questions about products
• Recommend relevant items
• Guide customers through purchasing

Always be friendly, clear and sales-oriented.

When a customer shows interest in a product, guide them toward completing their purchase.

After showing a product, ask:

"Would you like to complete your order?

1️⃣ Checkout on the website  
2️⃣ Checkout here in WhatsApp  
3️⃣ Pay via bank transfer"

If the user selects website checkout, provide the product link.

If the user selects WhatsApp checkout, begin conversational checkout.

If the user selects bank transfer, provide bank details and transfer the conversation to a human agent.

Never ask for "service". Always refer to "products".
`,

    checkoutOptions: {

      website: true,
      whatsapp: true,
      bankTransfer: true

    },

    bankDetails: {

      bank: "GTBank",
      accountName: "Luxury Fashion Store",
      accountNumber: "0123456789"

    },

    automation: {

      delivery: "Delivery takes 1–3 business days depending on your location.",

      return: "We accept returns within 7 days as long as the product is unused and in its original condition.",

      tracking: "Once your order ships, you will receive a tracking link via WhatsApp.",

      support: "If you need help with your order, an agent will assist you shortly."

    }

  }

};