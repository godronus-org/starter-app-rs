# starter-app-rs

Starter for a **Rust FastEdge HTTP app** in `godronus-org`. Click **Use this template**,
then follow the steps below. The pipeline itself lives in
[`godronus-org/toolkit`](https://github.com/godronus-org/toolkit) (`@v1`); this repo only
carries thin callers.

## After "Use this template"

The new repo's first commit runs **Deploy**, and it **fails until step 1 is done**.
That's deliberate: nothing gets created under a placeholder name.

1. `fastedge.jsonc`: set `app.name`. POC names start with `gdr-` (F25). Use
   `environments.preprod.app.name` if preprod needs a different name.
2. `Cargo.toml`: rename the crate (`name = "app"`). The wasm path follows it everywhere.
3. Replace this README and `src/lib.rs` with your app.
4. Push to `main`. Deploy creates the preprod app by name and opens a PR that writes
   back its id (T7).

## How it ships

| Event | Result |
|---|---|
| PR | CI (`cargo test`, build, `fastedge-test/`) + toolkit PR checks |
| Merge to `main` | Deploy to preprod; release-please opens/updates the release PR |
| Merge the release PR | Tag `vX.Y.Z` → release asset → Deploy to prod |
| Run **Deploy** on an older `v*` tag | Rollback |

Use conventional commits (`feat:`, `fix:`). Release-please ignores any other commit,
so nothing releases until the first `feat:` / `fix:`.

## Layout

- `src/lib.rs`: the app. `#[cfg_attr(not(test), fastedge::http)]` keeps `cargo test` working.
- `.cargo/config.toml`: the wasm target (`wasm32-wasip1`; async/wstd apps use `wasm32-wasip2`).
  CI and the toolkit both read it from here.
- `fastedge-test/`: black-box tests against the built wasm (`npm test`). `@gcoredev/fastedge-test`
  is pinned with its lockfile committed, and Renovate bumps it.
- `renovate.json`: the org preset from the toolkit.

## Local

```sh
cargo build --release
cargo test --target x86_64-unknown-linux-gnu
cd fastedge-test && npm ci && npm test
```

This repo is a template, so its own Release, Deploy and PR-check jobs are skipped
(`is_template`); only CI runs here.
