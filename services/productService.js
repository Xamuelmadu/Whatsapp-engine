const Product = require("../models/Product");

async function searchProducts(query, storeId){

  if (!storeId) {
    throw new Error("storeId is required");
  }

  const products = await Product.find({
    store_id: storeId,
    name: { $regex: query, $options: "i" }
  })
  .limit(5);

  return products;

}

async function getStoreProducts(merchantId){

  const products = await Product.find({ merchant_id: merchantId });

  return products;

}

module.exports = { searchProducts, getStoreProducts };