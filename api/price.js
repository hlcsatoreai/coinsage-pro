export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Missing symbol" });
  }

  try {
    const pair = symbol.toUpperCase().endsWith("USDT")
      ? symbol.toUpperCase()
      : symbol.toUpperCase() + "USDT";

    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
    );

    const data = await response.json();

    res.status(200).json({
      symbol: data.symbol,
      price: Number(data.price)
    });

  } catch (err) {
    res.status(500).json({ error: "Binance error" });
  }
}
