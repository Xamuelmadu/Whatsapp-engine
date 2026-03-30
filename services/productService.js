const Product = require("../models/Product");

async function searchProducts(query){

  const products = await Product.find({
    name: { $regex: query, $options: "i" }
  }).limit(3);

  return products;

}

module.exports = { searchProducts };