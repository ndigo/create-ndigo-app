/**
 * Drift guard: the two scaffold template copies of the decorator-lowering
 * plugin must stay byte-identical. The canonical copy lives in the ndigo
 * monorepo at `scripts/vite-plugin-lower-decorators.mjs` and is vendored here;
 * keep them in sync manually when the monorepo's copy changes.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = resolve(import.meta.dirname, '..');

describe('vite-plugin-lower-decorators sync', () => {
    const paths = [
        resolve(ROOT, 'templates', 'browser', 'scripts', 'vite-plugin-lower-decorators.mjs'),
        resolve(ROOT, 'templates', 'node', 'scripts', 'vite-plugin-lower-decorators.mjs'),
    ];

    test('both template copies are byte-identical', () => {
        const contents = paths.map((path) => readFileSync(path, 'utf8'));
        expect(contents[1]).toBe(contents[0]);
    });
});
