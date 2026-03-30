const cron = require("node-cron");
const { syncWooProducts } = require("./woocommerceSync");
const { syncShopifyProducts } = require("./shopifySync");

function startProductSync(){

  cron.schedule("*/10 * * * *", async () => {

    if(process.env.STORE_TYPE === "woocommerce"){
      await syncWooProducts();
    }

    if(process.env.STORE_TYPE === "shopify"){
      await syncShopifyProducts();
    }

  });

}

module.exports = { startProductSync };