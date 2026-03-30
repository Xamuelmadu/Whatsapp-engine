require("dotenv").config();

const express = require("express");
const { handleIncomingMessage } = require("./controllers/webhookController");

const app = express();
app.use(express.json());

const { startProductSync } = require("./services/productSyncScheduler");

startProductSync();

app.post("/webhook", async (req, res) => {

  const message =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    await handleIncomingMessage(message);
  }

  res.sendStatus(200);

});

app.listen(3000, () => {
  console.log("WhatsApp AI Engine running");
});