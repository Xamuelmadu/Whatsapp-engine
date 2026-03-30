const Conversation = require("../models/Conversation");

async function getConversation(phone){

  let convo = await Conversation.findOne({ phone });

  if(!convo){
    convo = await Conversation.create({
      phone,
      messages:[]
    });
  }

  return convo;
}

async function addMessage(phone, role, content){

  const convo = await getConversation(phone);

  convo.messages.push({
    role,
    content,
    timestamp:new Date()
  });

  await convo.save();
}

module.exports = {
  getConversation,
  addMessage
};