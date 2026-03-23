import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { input } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                  text: `Give a short Instagram caption about ${input}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
console.log(JSON.stringify(data, null, 2));
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Try again";

    res.json({ result: text });

  } catch (err) {
    console.log(err);
    res.json({ result: "❌ Error" });
  }
});

app.listen(3000, () => console.log("Server running"));
