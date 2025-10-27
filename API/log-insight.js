// api/log-insight.js
/**
 * Records that a user submitted an insight.
 * Increments total insights and daily insights.
 */

let fallbackInsights = global.__INSIGHT_FALLBACK__ || { total: 0, daily: {} };
global.__INSIGHT_FALLBACK__ = fallbackInsights;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = await req.json();
    const { } = body;

    try {
      const { kv } = await import("@vercel/kv");
      const day = new Date().toISOString().slice(0,10);
      await kv.incr("insights:total");
      await kv.incr(`insights:day:${day}`);
      return res.status(200).json({ ok: true, using: "kv" });
    } catch (e) {
      const day = new Date().toISOString().slice(0,10);
      fallbackInsights.total = (fallbackInsights.total || 0) + 1;
      fallbackInsights.daily[day] = (fallbackInsights.daily[day] || 0) + 1;
      return res.status(200).json({ ok: true, using: "fallback" });
    }
  } catch (e) {
    return res.status(400).json({ error: "Bad request" });
  }
}
