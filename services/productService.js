const Product = require("../models/Product");

async function searchProducts(query){

  const products = await Product.find({
    name: { $regex: query, $options: "i" }
  }).limit(3);

  return products;

}

async function getStoreProducts(merchantId){

  const products = await Product.find({ merchant_id: merchantId });

  return products;

}

module.exports = { searchProducts, getStoreProducts };