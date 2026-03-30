/*
--------------------------------
CHECK IF PRODUCT HAS VARIATIONS
--------------------------------
*/

function hasVariations(product){

  return product.variation_attributes &&
         Object.keys(
           Object.fromEntries(product.variation_attributes)
         ).length > 0

}



/*
--------------------------------
GET REQUIRED ATTRIBUTES
--------------------------------
*/

function getVariationAttributes(product){

  return Object.keys(
    Object.fromEntries(product.variation_attributes || {})
  )

}



/*
--------------------------------
FIND MISSING ATTRIBUTES
--------------------------------
*/

function getMissingAttributes(product,selected={}){

  const attributes = getVariationAttributes(product)

  return attributes.filter(attr => !selected[attr])

}



/*
--------------------------------
FIND MATCHING VARIANT
--------------------------------
*/

function findVariant(product,selected){

  if(!product.variants || product.variants.length === 0){
    return null
  }

  return product.variants.find(v => {

    return Object.entries(selected).every(
      ([key,value]) => v.attributes.get(key) === value
    )

  })

}



/*
--------------------------------
BUILD AI QUESTION
--------------------------------
*/

function buildVariationQuestion(product){

  const attributes = Object.entries(
    Object.fromEntries(product.variation_attributes || {})
  )

  let question = "Please choose an option:\n\n"

  attributes.forEach(([attr,values])=>{

    question += `${attr}: ${values.join(", ")}\n`

  })

  return question

}



module.exports = {

  hasVariations,
  getVariationAttributes,
  getMissingAttributes,
  findVariant,
  buildVariationQuestion

}