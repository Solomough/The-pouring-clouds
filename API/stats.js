// api/stats.js
/**
 * Returns aggregated stats:
 * { totalPrayers, prayersToday, prayersByCountry: { country:count }, totalInsights, insightsToday, avgDuration }
 *
 * If KV is available, reads counts from kv keys. Otherwise uses fallback.
 */

export default async function handler(req, res) {
  try {
    try {
      const { kv } = await import("@vercel/kv");

      const today = new Date().toISOString().slice(0,10);
      const [ total, todayCount, insightsTotal, insightsToday, durTotal, durCount ] = await Promise.all([
        kv.get("prayers:total"),
        kv.get(`prayers:day:${today}`),
        kv.get("insights:total"),
        kv.get(`insights:day:${today}`),
        kv.get("prayers:duration:total"),
        kv.get("prayers:duration:count"),
      ]);

      // gather countries (prefix keys)
      const countryKeys = await kv.keys("prayers:country:*");
      const countryPairs = {};
      for (const k of countryKeys) {
        const v = await kv.get(k);
        const name = k.split(":").slice(-1)[0];
        countryPairs[name] = Number(v || 0);
      }

      const avgDuration = durCount ? (Number(durTotal || 0) / Number(durCount || 1)) : 0;

      return res.status(200).json({
        totalPrayers: Number(total || 0),
        prayersToday: Number(todayCount || 0),
        prayersByCountry: countryPairs,
        totalInsights: Number(insightsTotal || 0),
        insightsToday: Number(insightsToday || 0),
        avgDurationSeconds: Number(avgDuration || 0)
      });
    } catch (e) {
      // fallback
      const fb = global.__PRAYER_FALLBACK__ || { total: 0, daily: {}, countries: {}, durations: { totalSeconds:0, count:0 } };
      const fbInsight = global.__INSIGHT_FALLBACK__ || { total: 0, daily: {} };
      const today = new Date().toISOString().slice(0,10);
      const avg = fb.durations.count ? fb.durations.totalSeconds / fb.durations.count : 0;
      return res.status(200).json({
        totalPrayers: fb.total || 0,
        prayersToday: fb.daily[today] || 0,
        prayersByCountry: fb.countries || {},
        totalInsights: fbInsight.total || 0,
        insightsToday: fbInsight.daily[today] || 0,
        avgDurationSeconds: avg
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
