import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundMotion from "../components/BackgroundMotion";
import useWakeLock from "../hooks/useWakeLock";
import { showToast } from "../utils/toast";

const MINUTES = 15;
const MIN_SECONDS = MINUTES * 60;

export default function Timer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(MIN_SECONDS);
  const [hasReachedMinimum, setHasReachedMinimum] = useState(false);
  const intervalRef = useRef(null);
  const { release } = useWakeLock(running);

  // prayer points
  const initialPoints =
    location.state?.prayerPoints ||
    (typeof window !== "undefined" ? localStorage.getItem("prayerPoints") : "") ||
    "";

  const [prayerPoints, setPrayerPoints] = useState(initialPoints);

  useEffect(() => {
    if (location.state?.prayerPoints) {
      try {
        localStorage.setItem("prayerPoints", location.state.prayerPoints);
      } catch (e) {}
    }
  }, [location.state]);

  // Timer tick logic
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        const next = s - 1;
        if (next <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setRunning(false);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  // Minimum reached
  useEffect(() => {
    const elapsed = MIN_SECONDS - secondsLeft;
    setHasReachedMinimum(elapsed >= MIN_SECONDS);
  }, [secondsLeft]);

  // when complete
  useEffect(() => {
    if (secondsLeft <= 0) {
      // chime + vibrate
      try {
        // Web Audio chime
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(660, ctx.currentTime);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        o.stop(ctx.currentTime + 1.3);
      } catch (e) {
        // ignore audio errors
      }

      try {
        if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
      } catch (e) {}

      if (release) release();
      showToast("Session complete. Move to reflection.", 3500);
      navigate("/scripture", { state: { prayerPoints } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const format = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // controls
  const handleStart = () => {
    if (secondsLeft <= 0) setSecondsLeft(MIN_SECONDS);
    setRunning(true);
    showToast("Prayer started. Keep your focus.", 2200);
  };

  const handlePause = () => {
    setRunning(false);
    showToast("Prayer paused.", 1600);
  };

  const handleEnd = () => {
    const elapsed = MIN_SECONDS - secondsLeft;
    if (elapsed < MIN_SECONDS) {
      showToast(`You can only end after ${MINUTES} minutes. Keep praying.`, 3000);
      return;
    }
    setRunning(false);
    if (release) release();
    showToast("Session ended. Move to reflection.", 2600);
    navigate("/scripture", { state: { prayerPoints } });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-4 py-16">
      <BackgroundMotion />

      <div className="w-full max-w-md mx-auto">
        {/* floating prayer points behind hourglass */}
        {prayerPoints ? (
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-28 max-w-xs text-center transform opacity-25 text-sm italic tracking-wide select-none"
            style={{ zIndex: 5 }}
          >
            {prayerPoints}
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-6">
          {/* Hourglass - large, flips while running */}
          <div
            className={`w-44 h-64 sm:w-56 sm:h-80 relative flex items-center justify-center`}
            aria-hidden
          >
            <svg
              viewBox="0 0 120 200"
              className={`w-full h-full transition-transform duration-700 ${running ? "animate-hourglass" : ""}`}
            >
              <g stroke="rgba(232,185,35,0.95)" strokeWidth="2" fill="none">
                <path d="M20 10 H100" />
                <path d="M20 10 Q60 40 100 10" />
                <path d="M20 190 Q60 160 100 190" />
                <rect x="18" y="8" width="84" height="184" rx="12" />
              </g>

              <g fill="rgba(232,185,35,0.9)">
                <ellipse cx="60" cy="46" rx="28" ry="10" opacity={running ? 0.95 : 0.6} />
                {running && <rect x="58" y="62" width="4" height="20" rx="2" fill="rgba(232,185,35,0.95)" />}
              </g>

              <g fill="rgba(232,185,35,0.95)">
                <ellipse cx="60" cy="150" rx="30" ry="12" opacity={0.9} />
              </g>
            </svg>

            <div className="absolute inset-0 rounded-xl pointer-events-none">
              <div className="w-full h-full rounded-xl shadow-[0_20px_60px_rgba(232,185,35,0.12)]" />
            </div>
          </div>

          {/* Timer plate */}
          <div className="w-full px-6">
            <div className="mx-auto w-fit bg-black/40 border border-white/6 rounded-2xl px-6 py-4 shadow-lg">
              <div className="text-xs uppercase text-white/70 text-center mb-1">Focused Prayer</div>
              <div className="text-5xl sm:text-6xl font-extrabold text-center tracking-wide">{format(secondsLeft)}</div>
            </div>
          </div>

          {/* controls */}
          <div className="flex gap-3 w-full justify-center mt-2">
            {!running ? (
              <button onClick={handleStart} className="flex-1 bg-arkgold text-black py-3 rounded-full font-semibold shadow-lg">
                Start Prayer
              </button>
            ) : (
              <button onClick={handlePause} className="flex-1 bg-white/10 py-3 rounded-full font-semibold">
                Pause
              </button>
            )}

            <button
              onClick={handleEnd}
              className={`flex-1 rounded-full py-3 font-semibold ${hasReachedMinimum ? "bg-arkgold text-black" : "bg-white/10 text-white/60"}`}
            >
              End Prayer
            </button>
          </div>

          <div className="text-center text-sm text-white/70 mt-3 px-4">
            <div>Minimum: {MINUTES} minutes. You can end only when the minimum completes.</div>
            <div className="mt-1 text-xs">Your prayer points float softly while you pray.</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hgFlip {
          0% { transform: rotateX(0deg) }
          50% { transform: rotateX(180deg) }
          100% { transform: rotateX(0deg) }
        }
        .animate-hourglass {
          transform-origin: center;
          animation: hgFlip 1.6s linear infinite;
        }
        @media (max-width: 480px) {
          .animate-hourglass { animation-duration: 1.2s; }
        }
      `}</style>
    </div>
  );
                  }
