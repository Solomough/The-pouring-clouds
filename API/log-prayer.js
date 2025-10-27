// api/log-prayer.js
/**
 * Records a prayer 'start' event:
 * - increments total prayers
 * - increments daily counter (YYYY-MM-DD)
 * - increments country counter if available from headers
 * - stores simple duration stats when provided (optional)
 *
 * Uses Vercel KV if available (recommended). Falls back to in-memory (dev only).
 */

let fallbackStore = global.__PRAYER_FALLBACK__ || { total: 0, daily: {}, countries: {}, durations: { totalSeconds:0, count:0 } };
global.__PRAYER_FALLBACK__ = fallbackStore;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = await (async () => {
    try { return await req.json(); } catch { return {}; }
  })();

  const secs = Number(body.durationSeconds || 0);

  // Attempt Vercel KV
  try {
    // dynamic import to avoid hard error if not installed
    const { kv } = await import("@vercel/kv");

    const now = new Date();
    const day = now.toISOString().slice(0, 10); // YYYY-MM-DD

    await kv.incr("prayers:total");
    await kv.incr(`prayers:day:${day}`);

    // country header (Vercel exposes geo headers in many cases)
    const country = (req.headers["x-vercel-ip-country"] || req.headers["x-vercel-country"] || body.country || "unknown").toLowerCase();
    if (country) await kv.incr(`prayers:country:${country}`);

    if (secs > 0) {
      await kv.incrby("prayers:duration:total", secs);
      await kv.incr("prayers:duration:count");
    }

    return res.status(200).json({ ok: true, using: "kv" });
  } catch (e) {
    // fallback: update in-memory store (dev only, not persistent)
    fallbackStore.total = (fallbackStore.total || 0) + 1;
    const now = new Date(); const day = now.toISOString().slice(0,10);
    fallbackStore.daily[day] = (fallbackStore.daily[day] || 0) + 1;
    const country = (req.headers["x-vercel-ip-country"] || req.headers["x-vercel-country"] || body.country || "unknown").toLowerCase();
    fallbackStore.countries[country] = (fallbackStore.countries[country] || 0) + 1;
    if (secs > 0) { fallbackStore.durations.totalSeconds += secs; fallbackStore.durations.count += 1; }

    return res.status(200).json({ ok: true, using: "fallback" });
  }
  }
