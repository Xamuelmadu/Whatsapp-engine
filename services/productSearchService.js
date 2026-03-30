const OpenAI = require("openai")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
})

function cosineSimilarity(a,b){
  const dot = a.reduce((sum,val,i)=>sum+val*b[i],0)
  const magA = Math.sqrt(a.reduce((sum,val)=>sum+val*val,0))
  const magB = Math.sqrt(b.reduce((sum,val)=>sum+val*val,0))
  return dot/(magA*magB)
}

async function searchProducts(products,message){

  const embedding = await openai.embeddings.create({
    model:"text-embedding-3-small",
    input:message
  })

  const queryVector = embedding.data[0].embedding

  const scored = products.map(p=>{

    if(!p.embedding) return {product:p,score:0}

    const score = cosineSimilarity(queryVector,p.embedding)

    return {product:p,score}

  })

  scored.sort((a,b)=>b.score-a.score)

  return scored.slice(0,3).map(s=>s.product)
}

module.exports = {
  searchProducts
}