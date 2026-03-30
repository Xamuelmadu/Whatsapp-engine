const clients = require("../clients/clientConfig");

function checkAutomation(from, message) {

  const client = clients[from];

  if (!client) return null;

  const text = message.toLowerCase();

  for (const keyword in client.automation) {

    if (text.includes(keyword)) {
      return client.automation[keyword];
    }

  }

  return null;
}

module.exports = { checkAutomation };