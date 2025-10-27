/**
 * Simple helper to show toasts from anywhere.
 * Usage: import { showToast } from '../utils/toast'; showToast('Hello', 3000);
 */
export function showToast(message, duration = 3500) {
  try {
    window.dispatchEvent(new CustomEvent("show-toast", { detail: { message, duration } }));
  } catch (e) {
    // fallback to alert if custom events blocked
    // eslint-disable-next-line no-alert
    alert(message);
  }
}
