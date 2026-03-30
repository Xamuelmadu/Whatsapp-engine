const AgentSession = require("../models/AgentSession");

async function activateAgent(phone){

  await AgentSession.findOneAndUpdate(
    { phone },
    {
      active: true,
      started_at: new Date()
    },
    { upsert: true }
  );

}

async function isAgentActive(phone){

  const session = await AgentSession.findOne({ phone });

  if(!session) return false;

  return session.active;
}

module.exports = {
  activateAgent,
  isAgentActive
};