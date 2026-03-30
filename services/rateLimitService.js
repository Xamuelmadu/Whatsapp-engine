const limits = new Map()

const WINDOW = 60000
const MAX_MESSAGES = 20

function checkRateLimit(phone){

  const now = Date.now()

  if(!limits.has(phone)){
    limits.set(phone,{count:1,start:now})
    return true
  }

  const record = limits.get(phone)

  if(now-record.start>WINDOW){
    limits.set(phone,{count:1,start:now})
    return true
  }

  if(record.count>=MAX_MESSAGES){
    return false
  }

  record.count++
  return true
}

module.exports = {
  checkRateLimit
}