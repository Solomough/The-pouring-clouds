import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import BackgroundMotion from "../components/BackgroundMotion";
import { scriptures } from "../data/scriptures";
import { useEffect, useMemo, useState, useRef } from "react";
import { copyToClipboard } from "../utils/clipboard";
import { showToast } from "../utils/toast";

export default function Landing() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const prayerRef = useRef(null);
  const [showOnboard, setShowOnboard] = useState(false);

  // cycle scriptures every 5s
  useEffect(() => {
    const i = setInterval(() => setIndex((s) => (s + 1) % scriptures.length), 5000);
    return () => clearInterval(i);
  }, []);

  // onboarding shown once
  useEffect(() => {
    try {
      const seen = localStorage.getItem("pc_onboard_v1");
      if (!seen) {
        setShowOnboard(true);
      }
    } catch (e) {}
  }, []);

  const closeOnboard = () => {
    try {
      localStorage.setItem("pc_onboard_v1", "1");
    } catch (e) {}
    setShowOnboard(false);
    showToast("Welcome. Begin in a moment of stillness.", 2600);
  };

  // animated scripture text (memoized)
  const currentScripture = useMemo(() => scriptures[index], [index]);

  const handleStart = () => {
    const prayerPoints = prayerRef.current?.value || "";
    // persist for timer page if user navigates manually
    try {
      localStorage.setItem("prayerPoints", prayerPoints);
    } catch (e) {}
    navigate("/timer", { state: { prayerPoints } });
  };

  const inviteText = "Join me on The Ark Network Prayer Cloud — let us pray and grow together.";

  const handleInviteCopy = async () => {
    const ok = await copyToClipboard(inviteText);
    if (ok) {
      showToast("Invite copied to clipboard. Paste anywhere to share.", 3000);
    } else {
      showToast("Copy failed. You can manually copy the invite.", 3000);
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
            className="w-48 h-48 object-cover rounded-full border-4 border-arkgold shadow-lg"
            style={{ objectPosition: "center" }}
          />
        </div>

        {/* Persuasive copy */}
        <section className="mt-6 p-4 rounded-xl bg-black/30 border border-white/5">
          <p className="mb-3 text-sm">
            Writing your vision brings clarity and ownership. “Where there is no vision the people perish.”
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

      {/* Onboarding overlay (Option C) */}
      {showOnboard && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-6">
          <div className="max-w-md w-full bg-gradient-to-b from-black/90 to-black/80 border border-white/6 rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Men ought always to pray and not faint</h3>
            <p className="mb-4 text-sm italic">The earnest prayer of a righteous person availeth much.</p>
            <p className="mb-6 text-sm">
              Prayer Cloud is a guided space to pray with focus. Start a 15-minute session, receive insight, and
              write down the vision God places in you.
            </p>
            <div className="flex justify-end">
              <button onClick={closeOnboard} className="bg-arkgold px-4 py-2 rounded-full font-semibold">
                Start Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
          }
