#!/usr/bin/env node
/**
 * Refresh the files vendored from the ndigo monorepo.
 *
 * Usage: node scripts/sync-vendored.mjs [--ndigo-dir /path/to/ndigo]
 *
 * Defaults to the sibling checkout ../ndigo. The monorepo must be present.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const idx = args.indexOf('--ndigo-dir');
const ndigoDir = idx >= 0 ? resolve(args[idx + 1]) : resolve(ROOT, '..', 'ndigo');

if (!existsSync(ndigoDir)) {
    console.error(`ndigo checkout not found at ${ndigoDir} (pass --ndigo-dir)`);
    process.exit(1);
}

const pairs = [
    ['scripts/vite-plugin-lower-decorators.mjs', 'templates/browser/scripts/vite-plugin-lower-decorators.mjs'],
    ['scripts/vite-plugin-lower-decorators.mjs', 'templates/node/scripts/vite-plugin-lower-decorators.mjs'],
    ['tools/agent-content/instructions/bootstrap.md', 'templates/browser/AGENTS.md.template'],
    ['tools/agent-content/instructions/bootstrap.md', 'templates/node/AGENTS.md.template'],
];

for (const [src, dst] of pairs) {
    const from = join(ndigoDir, src);
    const to = join(ROOT, dst);
    if (!existsSync(from)) { console.error(`missing source: ${from}`); process.exit(1); }
    copyFileSync(from, to);
    console.log(`synced ${src} -> ${dst}`);
}
console.log('done');