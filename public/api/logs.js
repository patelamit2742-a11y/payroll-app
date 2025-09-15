// api/logs.js  (Node serverless function on Vercel)
export default async function handler(req, res) {
  const SMART_URL = process.env.SMART_URL || "http://103.11.117.90:89/api/v2/WebAPI/GetDeviceLogs";
  const SMART_KEY = process.env.SMART_KEY || "";

  try {
    const isGET = req.method === "GET";
    const raw = isGET ? req.query : (typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {}));
    const payload = { ...raw, APIKey: SMART_KEY, Key: SMART_KEY };

    // Try GET first
    try {
      const r = await fetch(`${SMART_URL}?${new URLSearchParams(payload)}`, { method: "GET" });
      if (r.ok) return res.status(200).json(await r.json());
    } catch {}

    // Fallback: POST (form)
    try {
      const r = await fetch(SMART_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload),
      });
      if (r.ok) return res.status(200).json(await r.json());
    } catch {}

    // Fallback: POST (json)
    const r = await fetch(SMART_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
