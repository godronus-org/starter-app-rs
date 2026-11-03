import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import {
  defineTestSuite, runAndExit, runHttpRequest, assertHttpStatus, assertHttpBodyContains,
} from '@gcoredev/fastedge-test/test';

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(resolve(here, '..', p), 'utf8');
// Wasm path from Cargo.toml + .cargo/config.toml, so renaming the crate or target needs no edit here.
const cargo = read('Cargo.toml');
const crate = cargo.match(/^name = "([^"]+)"/m)[1].replace(/-/g, '_');
const version = cargo.match(/^version = "([^"]+)"/m)[1];
const target = read('.cargo/config.toml').match(/^\s*target\s*=\s*"([^"]+)"/m)[1];

await runAndExit(defineTestSuite({
  wasmPath: resolve(here, `../target/${target}/release/${crate}.wasm`),
  // fastedge-test 0.2.6: the key is `dotenv: { enabled, path }` — the README's `dotenvEnabled` is ignored (F-10).
  runnerConfig: { dotenv: { enabled: true, path: resolve(here, 'env/default') } },
  tests: [
    {
      name: 'GET / returns GREETING and the crate version',
      async run(runner) {
        const res = await runHttpRequest(runner, { path: '/', method: 'GET' });
        assertHttpStatus(res, 200);
        assertHttpBodyContains(res, `hi (v${version})`);
      },
    },
  ],
}));
