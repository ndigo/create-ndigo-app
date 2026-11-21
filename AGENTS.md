# create-ndigo-app — Agent Guidelines

Standalone scaffolder for Ndigo applications (node or browser kind). Extracted
from the `ndigo` monorepo; see `github.com/ndigo/ndigo`. The package is
development-time only: it stays on 0.x and is not published to npm.

## Commands

```bash
pnpm install          # install dependencies
pnpm build:lib        # tsc -b tsconfig.build.json → lib/
pnpm test             # vitest run
pnpm test:watch       # vitest
```

Node ≥ 24, pnpm ≥ 12. There is no lint or format script in this repo; keep
changes consistent with the conventions below.

## Code conventions (subset of the ndigo STYLE_GUIDE)

- ESM only. No CommonJS.
- TypeScript, target ES2022, module resolution Bundler.
- 4 spaces indentation, single quotes, semicolons always, 120-char print width.
- camelCase for functions/variables, PascalCase for types.
- TSDoc on public exports.

## Structure

- `src/` — scaffold logic (`index.ts` entry, `prompts`, `templates`, `types`, `ui-pointer`).
- `templates/` — `browser/` and `node/` scaffold templates (`{{key}}` placeholders).
- `bin/` — the `create-ndigo-app` bin shim.
- `test/` — vitest specs (scaffold, template purity, plugin sync).

## Vendored files (keep in sync manually)

Two files are copied from the `ndigo` monorepo and must be refreshed by hand:

- `templates/{browser,node}/AGENTS.md.template` ← `ndigo/tools/agent-content/instructions/bootstrap.md`
- `templates/{browser,node}/scripts/vite-plugin-lower-decorators.mjs` ← `ndigo/scripts/vite-plugin-lower-decorators.mjs`

`test/plugin-sync.spec.ts` asserts the two template copies are byte-identical.
The `.oxlintrc.json.template` files should be kept in sync with the
recommended preset in `ndigo/packages/ndigo-oxlint-plugin/src/recommended.ts`.

## Notes

- Templates use `{{key}}` placeholders (distinct from `${...}` template
  literals in generated TypeScript).
- The scaffold supports `--local` (or `CREATE_NDIGO_APP_LOCAL=1`) to rewrite
  `@ndigo/*` deps to `workspace:*` for development against a local checkout.
- Generated artifacts (`lib/`, `api/`) are gitignored; run `pnpm build:lib`.