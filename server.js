const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("🚀 CoinSage Pro API is running");
});

app.get("/price/:symbol", async (req, res) => {
  try {
    const symbol = (req.params.symbol || "").toUpperCase().trim();

    // accetta BTC, ETH ecc -> diventa BTCUSDT
    const pair = symbol.endsWith("USDT") ? symbol : `${symbol}USDT`;

    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
    );

    res.json({
      symbol: response.data.symbol,
      price: Number(response.data.price)
    });
  } catch (error) {
    res.status(500).json({ error: "Errore API Binance o simbolo non valido" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
