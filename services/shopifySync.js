const axios = require("axios");
const Product = require("../models/Product");

async function syncShopifyProducts() {

  const response = await axios.get(
    `https://${process.env.SHOPIFY_STORE}/admin/api/2024-01/products.json`,
    {
      headers:{
        "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN
      }
    }
  );

  const products = response.data.products;

  for(const p of products){

    await Product.findOneAndUpdate(
      { store_product_id: p.id },
      {
        name: p.title,
        description: p.body_html,
        price: p.variants[0].price,
        stock: p.variants[0].inventory_quantity,
        images: p.images.map(img => img.src),
        product_url: `https://${process.env.SHOPIFY_STORE}/products/${p.handle}`,
        last_synced: new Date()
      },
      { upsert: true }
    );

  }

  console.log("Shopify products synced");

}

module.exports = { syncShopifyProducts };