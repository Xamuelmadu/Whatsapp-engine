const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

async function presentProduct(product){

  const prompt = `
You are an expert e-commerce sales assistant.

A customer is asking about this product.

Product Name: ${product.name}
Price: ${product.price}
Description: ${product.description}

Your job:

1. Explain the product in a simple and persuasive way
2. Highlight its usefulness for the customer
3. Keep the response short and conversational
4. End with the question:

"Would you like to order this product now?"

Do not invent information not in the description.
`;

  const completion = await openai.chat.completions.create({

    model: "gpt-4.1-mini",

    messages: [
      { role: "system", content: "You are a professional e-commerce sales assistant." },
      { role: "user", content: prompt }
    ]

  });

  return completion.choices[0].message.content;

}

module.exports = { presentProduct };