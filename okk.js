async function chatWithGemma(message) {
  const response = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          model: "gemma3:1b", // Ensure this is the correct model name
          messages: [{ role: "user", content: message }]
      })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Process NDJSON lines
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep last incomplete line for next read

      for (const line of lines) {
          if (line.trim()) {
              try {
                  const json = JSON.parse(line);
                  process.stdout.write(json.message.content + " "); // Print smoothly
              } catch (err) {
                  console.error("JSON parse error:", err);
              }
          }
      }
  }
  console.log("\n"); // New line after response is complete
}

chatWithGemma("tell me a joke");
