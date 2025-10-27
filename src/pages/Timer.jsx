import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundMotion from "../components/BackgroundMotion";
import useWakeLock from "../hooks/useWakeLock";

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

  // prayer points from location state OR from localStorage for persistence
  const initialPoints =
    location.state?.prayerPoints ||
    (typeof window !== "undefined" ? localStorage.getItem("prayerPoints") : "") ||
    "";

  const [prayerPoints, setPrayerPoints] = useState(initialPoints);

  // If navigation provided prayerPoints, persist to localStorage for subsequent loads
  useEffect(() => {
    if (location.state?.prayerPoints) {
      try {
        localStorage.setItem("prayerPoints", location.state.prayerPoints);
      } catch (e) {
        // ignore storage errors
      }
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

    // start the interval
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        const next = s - 1;
        if (next <= 0) {
          // finished
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Compute whether minimum time elapsed to enable End button
  useEffect(() => {
    const elapsed = MIN_SECONDS - secondsLeft;
    setHasReachedMinimum(elapsed >= MIN_SECONDS);
  }, [secondsLeft]);

  // When timer hits 0 navigate to scripture
  useEffect(() => {
    if (secondsLeft <= 0) {
      // release wake lock if held
      if (release) release();
      navigate("/scripture", { state: { prayerPoints } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  // format mm:ss
  const format = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // controls
  const handleStart = () => {
    // If timer is at zero, reset
    if (secondsLeft <= 0) {
      setSecondsLeft(MIN_SECONDS);
    }
    setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
  };

  const handleEnd = () => {
    const elapsed = MIN_SECONDS - secondsLeft;
    if (elapsed < MIN_SECONDS) {
      alert(`You can only end after ${MINUTES} minutes. Keep praying.`);
      return;
    }
    setRunning(false);
    if (release) release();
    navigate("/scripture", { state: { prayerPoints } });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-4 py-16">
      <BackgroundMotion />

      <div className="w-full max-w-md mx-auto">
        {/* floating prayer points (subtle behind hourglass) */}
        {prayerPoints ? (
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-28 max-w-xs text-center transform opacity-30 
                       text-sm italic tracking-wide select-none blur-[0.2px]"
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
              className={`w-full h-full transition-transform duration-700 ${
                running ? "animate-hourglass" : ""
              }`}
            >
              {/* glass frame */}
              <g stroke="rgba(232,185,35,0.95)" strokeWidth="2" fill="none">
                <path d="M20 10 H100" />
                <path d="M20 10 Q60 40 100 10" />
                <path d="M20 190 Q60 160 100 190" />
                <rect x="18" y="8" width="84" height="184" rx="12" />
              </g>

              {/* top sand */}
              <g fill="rgba(232,185,35,0.9)" >
                <ellipse cx="60" cy="46" rx="28" ry="10" opacity={running ? 0.95 : 0.6} />
                {/* flow line */}
                {running && <rect x="58" y="62" width="4" height="20" rx="2" fill="rgba(232,185,35,0.95)" />}
              </g>

              {/* bottom sand (grows as time passes) */}
              <g fill="rgba(232,185,35,0.95)">
                {/* we'll use a mask-like approach by SVG rect with dynamic height using foreignObject not supported inline easily,
                    so we keep a static bottom shape with subtle opacity. */}
                <ellipse cx="60" cy="150" rx="30" ry="12" opacity={0.9} />
              </g>
            </svg>

            {/* subtle glow around hourglass */}
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
              <button
                onClick={handleStart}
                className="flex-1 bg-arkgold text-black py-3 rounded-full font-semibold shadow-lg"
              >
                Start Prayer
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 bg-white/10 py-3 rounded-full font-semibold"
              >
                Pause
              </button>
            )}

            <button
              onClick={handleEnd}
              className={`flex-1 rounded-full py-3 font-semibold ${
                hasReachedMinimum ? "bg-arkgold text-black" : "bg-white/10 text-white/60"
              }`}
            >
              End Prayer
            </button>
          </div>

          {/* helper text */}
          <div className="text-center text-sm text-white/70 mt-3 px-4">
            <div>Minimum: {MINUTES} minutes. You can end only when the minimum completes.</div>
            <div className="mt-1 text-xs">Your prayer points float softly while you pray.</div>
          </div>
        </div>
      </div>

      {/* hourglass flip animation CSS */}
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
      `}</style>
    </div>
  );
        }
