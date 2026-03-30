const OpenAI = require("openai");
const Product = require("../models/Product");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

async function recommendProducts(query){

  const products = await Product.find().limit(20);

  const catalog = products.map(p => ({
    name: p.name,
    description: p.description,
    price: p.price
  }));

  const prompt = `
A customer is looking for a product.

Customer request:
"${query}"

Here is the available product catalog:

${JSON.stringify(catalog)}

Select the 3 best products for this customer and explain briefly why they fit their needs.

Return only the recommendations in a friendly conversational tone.
`;

  const completion = await openai.chat.completions.create({

    model: "gpt-4.1-mini",

    messages: [
      { role: "system", content: "You are an e-commerce product recommendation assistant." },
      { role: "user", content: prompt }
    ]

  });

  return completion.choices[0].message.content;

}

module.exports = { recommendProducts };