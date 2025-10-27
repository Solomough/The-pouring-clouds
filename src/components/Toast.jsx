import { useEffect, useState } from "react";

/**
 * Lightweight toast system that listens for custom events:
 * window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, duration } }))
 */

export default function Toasts() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onShow(e) {
      const id = Math.random().toString(36).slice(2);
      const { message, duration = 3500 } = e.detail || {};
      setToasts((t) => [...t, { id, message }]);

      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, duration);
    }

    window.addEventListener("show-toast", onShow);
    return () => window.removeEventListener("show-toast", onShow);
  }, []);

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="min-w-[200px] max-w-xs bg-black/80 text-white px-4 py-3 rounded-lg shadow-lg border border-white/5"
        >
          <div className="text-sm">{t.message}</div>
        </div>
      ))}
    </div>
  );
          }
