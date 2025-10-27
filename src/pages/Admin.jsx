// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Admin() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setData).catch(()=>{});
  }, []);

  if (!data) return <div className="p-6 text-white">Loading...</div>;

  const countryData = Object.entries(data.prayersByCountry || {}).map(([k,v]) => ({ country: k.toUpperCase(), count: v }));
  return (
    <div className="p-6 text-white min-h-screen bg-black">
      <h1 className="text-2xl font-bold mb-4">Prayer Cloud — Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded">{data.totalPrayers} total prayers</div>
        <div className="p-4 bg-white/5 rounded">{data.prayersToday} today</div>
        <div className="p-4 bg-white/5 rounded">{data.totalInsights} insights</div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3">Prayers by country</h3>
        <div style={{ height: 300 }} className="bg-white/5 rounded p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryData.slice(0,20)}>
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="mb-3">Average prayer length (sec)</h3>
        <div className="p-4 bg-white/5 rounded">{Math.round(data.avgDurationSeconds || 0)}s</div>
      </div>
    </div>
  );
}
