const BASE_URL = "https://didactic-zebra-jjj4grgwgggq35p5v-5000.app.github.dev";

export const summarizeTranscript = async (transcript) => {
  try {
    const response = await fetch(`${BASE_URL}/api/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      throw new Error("Failed to get summary");
    }

    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    return { summary: "", tasks: [] };
  }
};
