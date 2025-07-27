const express = require("express");
const router = express.Router();
const { sendToSlack } = require("../integrations/slack");

router.post("/", async (req, res) => {
  const { summary } = req.body;

  if (!summary) {
    return res.status(400).json({ error: "Missing summary" });
  }

  try {
    await sendToSlack(summary); // No need to pass webhookUrl manually
    res.status(200).json({ success: true, message: "Sent to Slack" });
  } catch (err) {
    console.error("Slack error:", err.message);
    res.status(500).json({ error: "Failed to send to Slack" });
  }
});

module.exports = router;
