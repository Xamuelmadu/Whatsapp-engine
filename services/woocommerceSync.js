const axios = require("axios");
const Product = require("../models/Product");

async function syncWooProducts() {

  const response = await axios.get(
    `${process.env.WOO_URL}/wp-json/wc/v3/products`,
    {
      auth: {
        username: process.env.WOO_KEY,
        password: process.env.WOO_SECRET
      }
    }
  );

  const products = response.data;

  for (const p of products) {

    await Product.findOneAndUpdate(
      { store_product_id: p.id },
      {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock_quantity,
        images: p.images.map(img => img.src),
        product_url: p.permalink,
        last_synced: new Date()
      },
      { upsert: true }
    );

  }

  console.log("WooCommerce products synced");

}

module.exports = { syncWooProducts };