/**
 * Bounds how many tasks run at once. Excess calls queue up (FIFO) and run as slots free.
 *
 * Used to cap concurrent /register-gewerbe processing: each request spins up a fresh
 * xmllint-wasm worker thread (its own heap) and makes blocking ERiC native calls, so
 * unbounded concurrency multiplies memory/CPU pressure per in-flight request.
 */
export function createConcurrencyLimiter(maxConcurrent: number) {
  let active = 0;
  const queue: (() => void)[] = [];

  function acquire(): Promise<void> {
    if (active < maxConcurrent) {
      active++;
      return Promise.resolve();
    }
    return new Promise((resolve) => queue.push(resolve));
  }

  function release(): void {
    const next = queue.shift();
    if (next) {
      next();
    } else {
      active--;
    }
  }

  return async function withLimit<T>(task: () => Promise<T>): Promise<T> {
    await acquire();
    try {
      return await task();
    } finally {
      release();
    }
  };
}
