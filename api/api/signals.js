export default async function handler(req, res) {
  // Per ora per semplicità: signals = scan live
  // Più avanti: qui leggeremo dallo storage (DB/KV)
  const baseUrl = `https://${req.headers.host}`;
  const r = await fetch(`${baseUrl}/api/scan`);
  const data = await r.json();
  res.status(200).json(data);
}
