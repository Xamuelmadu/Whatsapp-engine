const axios = require("axios")

async function getMerchantByNumber(number){

  const res = await axios.get(
    `${process.env.PLATFORM_API}/api/engine/merchant/${number}`
  )

  return res.data

}

module.exports = { getMerchantByNumber }