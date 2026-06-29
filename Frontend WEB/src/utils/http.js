// Small HTTP helpers with retry and AbortController support

/**
 * Fetch JSON with basic error handling
 * @param {string} url
 * @param {RequestInit & { timeout?: number }} options
 */
export async function fetchJSON(url, options = {}) {
  // Combine caller-provided signal with an internal timeout signal
  const timeout = options.timeout ?? 15000; // 15s
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort('timeout'), timeout);

  let signal = controller.signal;
  const userSignal = options.signal;
  if (userSignal && userSignal !== controller.signal) {
    // If caller passed a signal, abort our controller when theirs aborts too
    if (userSignal.aborted) {
      controller.abort(userSignal.reason);
    } else {
      userSignal.addEventListener('abort', () => controller.abort(userSignal.reason), { once: true });
    }
  }

  try {
    const res = await fetch(url, { ...options, signal });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${res.statusText}${text ? ` - ${text.substring(0,140)}` : ''}`);
    }
    return await res.json();
  } catch (err) {
    // If aborted due to timeout, tag as TimeoutError for clearer handling
    if (controller.signal.aborted && controller.signal.reason === 'timeout') {
      try { err.name = 'TimeoutError'; } catch {}
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch with 1 retry on network errors or AbortError
 * @param {string} url
 * @param {RequestInit & { retries?: number, timeout?: number }} options
 */
export async function fetchWithRetry(url, options = {}) {
  const { retries = 1, ...rest } = options;
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchJSON(url, rest);
    } catch (err) {
      lastErr = err;
      // Only retry for transient network type errors (do not retry AbortError from unmounts)
      if (
        attempt < retries &&
        (err.name === 'TimeoutError' || err.message?.includes('NetworkError') || err.message?.includes('Failed to fetch'))
      ) {
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

/**
 * Utility to detect AbortError across browsers
 * @param {unknown} err
 */
export function isAbortError(err) {
  if (err == null) return false;
  if (typeof err === 'string') {
    return /(abort|canceled|cancelled|component-unmount)/i.test(err);
  }
  const msg = typeof err.message === 'string' ? err.message.toLowerCase() : '';
  return err.name === 'AbortError' || err?.code === 20 || msg.includes('abort');
}
