import { describe, it, expect } from "vitest";
import { createConcurrencyLimiter } from "./concurrencyLimiter";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

describe("createConcurrencyLimiter", () => {
  it("runs tasks up to the limit immediately", async () => {
    const withLimit = createConcurrencyLimiter(2);
    let running = 0;
    let maxObserved = 0;
    const gates = [deferred<void>(), deferred<void>(), deferred<void>()];

    const results = gates.map((gate, i) =>
      withLimit(async () => {
        running++;
        maxObserved = Math.max(maxObserved, running);
        await gate.promise;
        running--;
        return i;
      }),
    );

    // let the first two tasks start
    await Promise.resolve();
    await Promise.resolve();
    expect(maxObserved).toBe(2);

    gates[0]!.resolve();
    await Promise.resolve();
    await Promise.resolve();
    gates[1]!.resolve();
    gates[2]!.resolve();

    expect(await Promise.all(results)).toEqual([0, 1, 2]);
    expect(maxObserved).toBe(2);
  });

  it("propagates task errors without leaking the slot", async () => {
    const withLimit = createConcurrencyLimiter(1);

    await expect(
      withLimit(async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    // slot must have been released despite the rejection
    await expect(withLimit(async () => "ok")).resolves.toBe("ok");
  });
});
