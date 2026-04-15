// @ts-nocheck
/**
 * Global API request queue to prevent rate limiting.
 * Wraps Base44 SDK calls with a concurrency limiter and retry logic.
 */

const MAX_CONCURRENT = 2;
const MIN_DELAY_MS = 350;
const MAX_RETRIES = 3;

let activeCount = 0;
const queue = [];

function processQueue() {
  while (activeCount < MAX_CONCURRENT && queue.length > 0) {
    const { fn, resolve, reject } = queue.shift();
    activeCount++;
    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        activeCount--;
        // Small delay between requests
        setTimeout(processQueue, MIN_DELAY_MS);
      });
  }
}

/**
 * Queue an async function to be executed with concurrency control.
 * Automatically retries on 429 rate limit errors.
 */
export function queueRequest(fn) {
  return new Promise((resolve, reject) => {
    const wrappedFn = async () => {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          return await fn();
        } catch (err) {
          const isRateLimit =
            err?.response?.status === 429 ||
            err?.message?.includes('Rate limit');
          if (isRateLimit && attempt < MAX_RETRIES - 1) {
            // Exponential backoff: 1s, 2s, 4s
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
            continue;
          }
          throw err;
        }
      }
    };
    queue.push({ fn: wrappedFn, resolve, reject });
    processQueue();
  });
}