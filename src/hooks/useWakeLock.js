import { useEffect, useRef } from "react";

/**
 * useWakeLock - requests a screen wake lock while enabled is true.
 * Returns an object with a release function (not necessary to call).
 */
export default function useWakeLock(enabled) {
  const wakeLockRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function requestLock() {
      try {
        if (!("wakeLock" in navigator)) return;
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        // re-request on visibility change
        const handleVisibility = async () => {
          if (document.visibilityState === "visible" && mounted) {
            wakeLockRef.current = await navigator.wakeLock.request("screen");
          }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        wakeLockRef.current._cleanup = () =>
          document.removeEventListener("visibilitychange", handleVisibility);
      } catch (e) {
        // silently ignore; feature not supported or blocked
        console.warn("Wake Lock not available:", e);
      }
    }

    if (enabled) requestLock();

    return () => {
      mounted = false;
      if (wakeLockRef.current) {
        try {
          wakeLockRef.current.release();
        } catch {}
        if (wakeLockRef.current._cleanup) wakeLockRef.current._cleanup();
        wakeLockRef.current = null;
      }
    };
  }, [enabled]);

  return {
    release: async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
        } catch {}
        wakeLockRef.current = null;
      }
    }
  };
    }
