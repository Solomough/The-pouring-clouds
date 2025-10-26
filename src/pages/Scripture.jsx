import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundMotion from "../components/BackgroundMotion";
import { scriptures } from "../data/scriptures";

export default function Scripture() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const prayerPoints = location.state?.prayerPoints || "";

  useEffect(() => {
    const i = setInterval(() => setIndex((s) => (s + 1) % scriptures.length), 5000);
    return () => clearInterval(i);
  }, []);

  const handleContinue = () => {
    navigate("/insight", { state: { prayerPoints } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-6">
      <BackgroundMotion />
      <div className="max-w-xl text-center">
        <h2 className="text-xl font-bold mb-4">Meditate on this</h2>
        <div className="text-arkgold text-lg mb-6">{scriptures[index]}</div>

        {prayerPoints ? (
          <div className="mb-6 p-3 rounded bg-black/30 border border-white/5">
            <div className="text-sm font-semibold mb-1">Your prayer points</div>
            <div className="text-sm italic">{prayerPoints}</div>
          </div>
        ) : null}

        <button onClick={handleContinue} className="bg-arkgold text-black px-6 py-3 rounded-full">
          Continue
        </button>
      </div>
    </div>
  );
}
