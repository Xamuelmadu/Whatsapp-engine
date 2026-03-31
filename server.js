require("dotenv").config();

const express = require("express");
const app = express();

// Controllers
const { handleIncomingMessage } = require("./controllers/webhookController");

// Services
const { startProductSync } = require("./services/productSyncScheduler");

// Middleware
app.use(express.json());

// ✅ Start background jobs
startProductSync();


// =============================
// ✅ HEALTH CHECK ROUTE
// =============================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "whatsapp-ai-engine",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});


// =============================
// ✅ META WEBHOOK VERIFICATION
// =============================
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});


// =============================
// ✅ INCOMING MESSAGES
// =============================
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    const message =
      body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    const metadata =
      body.entry?.[0]?.changes?.[0]?.value?.metadata;

    if (message) {
      await handleIncomingMessage(message, metadata);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.sendStatus(500);
  }
});


// =============================
// ✅ GLOBAL ERROR HANDLER
// =============================
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});


// =============================
// ✅ START SERVER (RAILWAY SAFE)
// =============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 WhatsApp AI Engine running on port ${PORT}`);
});