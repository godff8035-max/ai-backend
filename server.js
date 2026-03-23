const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTE
app.post("/generate", async (req, res) => {
  try {
    const { input } = req.body;

    const response = await fetch(
     `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a short Instagram caption about ${input}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

    let text = "⚠️ Try again";

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      text = data.candidates[0].content.parts[0].text;
    }

    res.json({ result: text });

  } catch (err) {
    console.log(err);
    res.json({ result: "❌ Error" });
  }
});

// ✅ IMPORTANT (Render needs this)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
