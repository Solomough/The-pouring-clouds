import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundMotion from "../components/BackgroundMotion";
import { copyToClipboard } from "../utils/clipboard";

export default function InsightForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const prayerPoints = location.state?.prayerPoints || "";
  const insightRef = useRef(null);
  const dreamRef = useRef(null);
  const [promptVisible, setPromptVisible] = useState(false);
  const founderPhone = "2347076560169";

  const handleSubmit = async () => {
    const insight = insightRef.current?.value || "";
    const dream = dreamRef.current?.value || "";

    const message = `Prayer Insight:\n${insight}\n\nFuture Desire:\n${dream}\n\n#PrayerCloud`;

    // Copy to clipboard first (fast UX)
    const ok = await copyToClipboard(message);
    if (ok) {
      alert("Your thoughts have been copied to clipboard. Paste in your notes to keep them alive.");
    } else {
      alert("Could not copy automatically. Please copy manually from the text area.");
    }

    // show share prompt
    setPromptVisible(true);

    // optionally store analytics later (Vercel KV) - placeholder for future
    // e.g. fetch('/api/submit', {method:'POST', body: JSON.stringify({insight,dream})})
  };

  const handleShareYes = () => {
    const insight = insightRef.current?.value || "";
    const dream = dreamRef.current?.value || "";
    const message = encodeURIComponent(
      `Prayer Insight:\n${insight}\n\nFuture Desire:\n${dream}\n\n#PrayerCloud`
    );
    window.open(`https://wa.me/${founderPhone}?text=${message}`, "_blank");
    navigate("/success");
  };

  const handleShareNo = () => {
    alert("Thanks for praying. Keep meditating.");
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 text-white">
      <BackgroundMotion />
      <div className="max-w-xl mx-auto">
        <h2 className="font-bold text-lg mb-4">Write what the Spirit gave you</h2>

        <div className="mb-3 text-sm text-white/80">Your prayer points (for reference)</div>
        <div className="mb-4 p-3 bg-black/30 rounded">{prayerPoints || "—"}</div>

        <textarea
          ref={insightRef}
          rows="4"
          placeholder="Insight..."
          className="w-full bg-black/40 border border-arkgold p-3 mb-4 resize-none"
        />

        <textarea
          ref={dreamRef}
          rows="3"
          placeholder="Where will you be in a few months..."
          className="w-full bg-black/40 border border-arkgold p-3 mb-4 resize-none"
        />

        <button onClick={handleSubmit} className="bg-arkgold text-black w-full py-3 rounded-full">
          Complete & Copy
        </button>

        {/* prompt modal-like area */}
        {promptVisible && (
          <div className="mt-4 p-4 rounded bg-black/40 border border-white/5">
            <div className="mb-3">Will you like to share your vision with the Founder for special mentorship sessions?</div>
            <div className="flex gap-3">
              <button onClick={handleShareYes} className="bg-arkgold text-black px-4 py-2 rounded-full">
                Yes — Share with Founder
              </button>
              <button onClick={handleShareNo} className="bg-white/10 px-4 py-2 rounded-full">
                No — Thanks
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
