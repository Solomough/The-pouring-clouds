import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import BackgroundMotion from "../components/BackgroundMotion";
import { scriptures } from "../data/scriptures";
import { useEffect, useMemo, useState, useRef } from "react";
import { copyToClipboard } from "../utils/clipboard";

export default function Landing() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const prayerRef = useRef(null);

  // cycle scriptures every 5s
  useEffect(() => {
    const i = setInterval(() => setIndex((s) => (s + 1) % scriptures.length), 5000);
    return () => clearInterval(i);
  }, []);

  // animated scripture text (memoized)
  const currentScripture = useMemo(() => scriptures[index], [index]);

  const handleStart = () => {
    // read prayer points and navigate to timer, pass points via navigation state
    const prayerPoints = prayerRef.current?.value || "";
    navigate("/timer", { state: { prayerPoints } });
  };

  const inviteText = "Join me on The Ark Network Prayer Cloud — let us pray and grow together.";

  const handleInviteCopy = async () => {
    const ok = await copyToClipboard(inviteText);
    if (ok) {
      alert("Invite copied to clipboard. Paste anywhere to share.");
    } else {
      alert("Could not copy. You can manually copy: " + inviteText);
    }
  };

  return (
    <div className="relative flex flex-col items-center text-center min-h-screen text-white px-6 pt-24">
      <BackgroundMotion />
      <div className="max-w-3xl w-full">
        <header className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="Logo" className="w-28 mb-1" />
          <h1 className="text-4xl font-bold leading-tight">Prayer Cloud</h1>
          <p className="text-sm max-w-2xl">
            A youth movement shaping mindsets — vision + execution. Founded by{" "}
            <strong>Solomon Moughkaa Zahemen</strong>.
          </p>
        </header>

        {/* Founder exposed bigger */}
        <div className="mt-6 flex items-center gap-6 justify-center">
          <img
            src="/founder.png"
            alt="Founder"
            className="w-40 h-40 object-cover rounded-full border-4 border-arkgold shadow-lg"
          />
        </div>

        {/* Persuasive copy */}
        <section className="mt-6 p-4 rounded-xl bg-black/30 border border-white/5">
          <p className="mb-3 text-sm">
            Writing your vision brings clarity and ownership. "Where there is no vision the people perish."
            When you write your desires and insights, the Lord aligns your steps and the vision becomes actionable.
            Trust in the Lord and He will give you the desires of your heart.
          </p>

          <p className="text-sm">
            How Prayer Cloud works: Start a focused prayer session (minimum 15 minutes), meditate on a rotating
            scripture, then write down the insight you received. You can copy your thoughts and choose to share them
            with the Founder for mentorship.
          </p>
        </section>

        {/* Dynamic scripture */}
        <div className="mt-6">
          <motion.div
            key={currentScripture}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-arkgold font-semibold text-lg"
          >
            {currentScripture}
          </motion.div>
        </div>

        {/* Input for prayer points (before timer) */}
        <div className="mt-6">
          <label className="block text-sm mb-2">Write your prayer points (optional)</label>
          <textarea
            ref={prayerRef}
            rows="3"
            placeholder="e.g. wisdom for the project, praying for your nations..."
            className="w-full rounded-lg p-3 bg-black/40 border border-arkgold placeholder:opacity-60"
          />
        </div>

        {/* CTAs */}
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={handleStart}
            className="bg-arkgold text-black font-semibold px-6 py-3 rounded-full shadow"
          >
            Start Prayer
          </button>
          <button
            onClick={handleInviteCopy}
            className="bg-white/10 text-white px-4 py-3 rounded-full border border-white/10"
          >
            Invite Someone
          </button>
        </div>
      </div>
    </div>
  );
}
