# Make `sendFsE` / `validateFsE` non-blocking (async koffi call)

**Package:** `@digitalservicebund/unternehmen-steuer-gewerbe-privat@3.1.0-205`
**koffi:** `3.0.2`
**Reported from:** `unternehmen-steuer-gewerbe` (consumer), load test `registerGewerbe.load.test.ts`

## Summary

`sendFsE` (and `validateFsE`) are **synchronous** native ERIC calls via koffi/FFI. Because
they run on the main thread, they block Node's single-threaded event loop for the full
duration of the ERIC submission. Under concurrent load this serializes all requests and
starves unrelated async I/O happening in parallel.

## Impact / repro

In the consumer, `POST /register-gewerbe` runs two things per request in parallel:

```ts
const [gewerbeanmeldung, fseÜbermittlung] = await Promise.all([
  submitGewerbeanmeldung(data), // async: HTTP fetch to PVOG (5s AbortSignal.timeout)
  submitFsE(data), // sync:  validateFsE() + sendFsE() — blocking koffi
]);
```

Load test: **100 concurrent** requests.

Observed:

- All 100 `sendFsE` calls **succeed**, but take ~38s wall-clock total (they serialize on the loop).
- Every parallel PVOG fetch **aborts** with `TimeoutError` (5s), even though only one network
  call is actually made (consumer caches + dedupes the lookup).
- Endpoint returns **207** (FsE ok, Gewerbe failed) instead of 200.

Root cause: `AbortSignal.timeout(5000)` counts **wall-clock**. While the loop is blocked
processing 100 synchronous ERIC submissions, the fetch's response callback can't be
scheduled within 5s → it aborts. The blocking sync op wins; the time-bounded async op starves.
This is the classic event-loop-starvation signature: the synchronous work all succeeds, only
the concurrent async work times out.

## Why `async` alone does NOT fix it

Wrapping the existing sync call in an `async` function only changes the return type to a
Promise — the native FFI call still executes on the main thread between `await` points and
still blocks the loop. The work must actually **leave the main thread**.

## Proposed fix

Switch the ERIC calls from synchronous koffi invocation to koffi's **asynchronous** form,
which runs the native call on libuv's worker thread pool and resolves a Promise on completion:

```js
// koffi async call runs on the libuv threadpool, off the main event loop
const result = await new Promise((resolve, reject) =>
  ericFn.async(...args, (err, res) => (err ? reject(err) : resolve(res))),
);
```

New signatures would become:

```ts
export declare function validateFsE(xml: string): Promise<ValidationResultFsE>;
export declare function sendFsE(xml: string, returnPdf?: boolean): Promise<SendFsEResult>;
```

(Breaking change — consumers add `await`; the consumer is ready for this.)

## Things to confirm on the library side

1. **ERIC thread-safety.** The native lib must tolerate concurrent calls from multiple
   threads. If ERIC isn't thread-safe per handle, use per-thread instances or serialize calls
   through a pool/queue inside the library.
2. **libuv pool size.** Defaults to 4 (`UV_THREADPOOL_SIZE`). Off-loaded ERIC calls queue
   4-at-a-time — still a huge win (async I/O no longer starves), but ERIC throughput stays
   pool-bounded. Document the recommended `UV_THREADPOOL_SIZE` and/or add an internal
   concurrency limit.
3. Apply the same treatment to any other blocking native entry points (e.g. initialization).

## Acceptance

- `sendFsE` / `validateFsE` return Promises backed by off-thread koffi calls.
- A concurrency test issuing N parallel `sendFsE` calls shows the main loop stays responsive
  (e.g. a parallel `setTimeout` / timer fires on schedule, not delayed by Nx the call time).
