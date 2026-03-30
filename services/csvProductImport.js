const fs = require("fs");
const csv = require("csv-parser");
const Product = require("../models/Product");

function importProducts(filePath){

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", async (row) => {

      await Product.create({
        name: row.name,
        price: row.price,
        description: row.description,
        product_url: row.link
      });

    })
    .on("end", () => {

      console.log("CSV products imported");

    });

}

module.exports = { importProducts };