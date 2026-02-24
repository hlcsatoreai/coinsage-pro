export default async function handler(req, res) {
  try {
    // prendo TUTTE le coin 24h da Binance
    const r = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    const all = await r.json();

    // filtro solo USDT e scarto leva/derivati strani (opzionale)
    const usdt = all
      .filter(x => x.symbol.endsWith("USDT"))
      .map(x => ({
        symbol: x.symbol,
        last: Number(x.lastPrice),
        changePct: Number(x.priceChangePercent),
        volQuote: Number(x.quoteVolume),
        trades: Number(x.count),
      }));

    // prendo le 50 più liquide
    const topLiquid = usdt
      .sort((a, b) => b.volQuote - a.volQuote)
      .slice(0, 50);

    // scoring semplice (poi lo rendiamo avanzato)
    const scored = topLiquid
      .map(x => {
        const score = Math.max(
          0,
          Math.min(
            100,
            50 + (x.changePct * 1.2) + (Math.log10(x.volQuote + 1) * 6)
          )
        );
        return { ...x, score: Math.round(score) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // ritorna segnali “live”
    res.status(200).json({
      updatedAt: new Date().toISOString(),
      signals: scored
    });
  } catch (e) {
    res.status(500).json({ error: "Scan failed" });
  }
}
