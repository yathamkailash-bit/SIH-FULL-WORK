/**
 * KALAKRITI Gemini Serverless Proxy Service
 * Routes Gemini requests through a serverless/Firebase Cloud Function endpoint
 * to ensure API keys are protected on server-side and never exposed in client network requests.
 */

const FUNCTION_ENDPOINT = import.meta.env?.VITE_GEMINI_CLOUD_FUNCTION_URL || '';

/**
 * Proxy executor for Gemini calls.
 * Uses Cloud Function endpoint if set; falls back gracefully to serverless proxy pattern.
 */
export const invokeGeminiProxy = async ({ action, payload }) => {
  if (FUNCTION_ENDPOINT) {
    try {
      const response = await fetch(FUNCTION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('[KalaKriti] ⚠️ Cloud function proxy unreachable, using direct endpoint fallback:', err.message);
    }
  }
  return null;
};
