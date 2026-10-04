/**
 * Intentional no-op boundary. A consent-aware analytics provider can be injected
 * here later; UI components should not call third-party trackers directly.
 */
export const Analytics = {
  track(event, payload = {}) {
    if (import.meta?.env?.DEV) console.debug('[FestivalCart]', event, payload);
  }
};

