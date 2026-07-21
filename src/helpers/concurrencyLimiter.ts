/**
 * Counting semaphore.
 * Function called in "withLimits()" is restricted in how many such tasks run at once. Excess calls queue up (FIFO) and run as soon as slots are free.
 *
 * Used to cap concurrent /register-gewerbe processing of gewerbeanmeldung/FsE submission pairs.
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
