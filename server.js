import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "*/*" }));

app.use(async (req, res) => {
  try {
    const apiUrl = "https://api.openai.com" + req.url;

    const apiRes = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"],
        "Authorization": req.headers["authorization"], // 使用 SillyTavern 传来的 key
      },
      body: req.body && typeof req.body === "string" ? req.body : JSON.stringify(req.body),
    });

    const text = await apiRes.text();

    res.status(apiRes.status).send(text);
  } catch (e) {
    res.status(500).send(JSON.stringify({ error: e.message }));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy running on " + PORT));
