# A cached self-accepted module gains an unloaded synchronous dependency

Standalone reproduction with **unmodified webpack 5.112.2**, Node.js 22 or newer. No Rspack patches, runtime monkey-patching, dev server, framework, or browser reload fallback.

## Run

```sh
npm ci
npm test
npm run test:control
```

`npm test` asserts the desired behavior and is expected to **exit 1 on the affected version**. The control is expected to exit 0. Each invocation recreates only the gitignored `.work/` directory; tracked source files are unchanged.

## Scenario

Execute dep=2 from shared. HMR the entry to drop its synchronous dep import; leave an uncalled other import which still references dep and n. Dep stays cached. Then edit dep to synchronously require unchanged n from the never-loaded extra chunk.

The starting files are in [src](src); [steps](steps) contains the exact edits. [reproduce.cjs](reproduce.cjs) performs those edits and applies HMR. The small [harness](harness.cjs) uses webpack's public Node API, persisting compilation records between successive builds, then executes webpack's real emitted runtime.

## Actual and expected behavior

Here the edited dep factory DOES arrive, unlike the ownership repro. Self-accept re-executes it, but n is missing. Tracking the owning chunk alone therefore does not guarantee that a cached module's new synchronous dependencies are installed.

The assertions express the expected result. See [observed.json](observed.json) for the captured failing run and [control.json](control.json) for its successful control. Generated chunks and update files are left in `.work/dist/`; each run also writes `results/last-run.json` with the compilation hashes, chunk/module membership, manifests, and result.

## Control

Load other before editing dep, so extra/n has already been installed. The same hot edit then succeeds.

## Scope

Verified on 2026-10-28. HMR compiler and JavaScript HMR runtime files in the npm release match webpack main commit `bd8eddff945733f65ada91ad441ce8b613f1544a` byte-for-byte. This is **not** a claim that every file or target on main was tested.
