const fetch = require("node-fetch");

const sendToSlack = async (summary) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Slack webhook URL is not defined in .env");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: `📝 *Meeting Summary:*\n\n${summary}` }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Slack webhook failed: ${response.status} - ${errorText}`);
  }
};

module.exports = { sendToSlack };
