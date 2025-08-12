const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(".")); // Serve index.html and other files

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "No reply";
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ reply: "Error connecting to AI API" });
    }
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
