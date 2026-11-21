/**
 * The `--ui` pointer: the version-free configuration the scaffold may write.
 *
 * Only pointers live here. Tokens, components, and the lockfile are
 * version-bearing content written by `ndigo ui` from the registry, so nothing
 * in this module duplicates `packages/ndigo-ui/registry/`.
 */
import type { PlannedFile } from './types.js';
/** The pointer file, matching `ndigo ui init` byte for byte. */
export declare const UI_CONFIG_FILE = "ndigo.ui.json";
/** The application stylesheet that carries the token import. */
export declare const UI_STYLESHEET = "src/styles.css";
/**
 * The `ndigo.ui.json` payload — the same schema, registry default, and alias
 * table `ndigo ui init` writes.
 *
 * @returns The pointer file content, newline-terminated.
 */
export declare function uiConfig(): string;
/**
 * The entry stylesheet: the canonical `--nd-*` tokens, imported from the
 * package rather than copied in. The registry's `theme` item is the copy-in
 * alternative; an application uses one or the other, never both.
 *
 * @returns The stylesheet content.
 */
export declare function uiStylesheet(): string;
/**
 * Resolves the pointer files for a `--ui` scaffold.
 *
 * @returns The planned `ndigo.ui.json` and `src/styles.css` entries.
 */
export declare function planUiPointer(): PlannedFile[];
/**
 * The AGENTS.md section appended when an agent bootstrap and the design system
 * are both requested. It is scaffold-time content, not part of the managed
 * `tools/agent-content/` block the CLI owns.
 */
export declare const UI_AGENTS_SECTION = "\n## Design system\n\nThis app uses the Ndigo design system. `src/styles.css` imports the `--nd-*`\ntokens from `@ndigo/ui`; style with those tokens (`var(--nd-color-surface)`,\n`var(--nd-space-4)`) rather than literal values. Components install as copy-in\nsource with `ndigo ui add <item>` (see `ndigo ui list`); `ndigo.ui.json`\nrecords the registry and the `@ui`/`@lib`/`@components`/`@hooks` aliases.\n";
/**
 * The next-steps hint printed when the pointer is written. Names a component
 * item, not `theme`: the token import already covers the theme layer.
 */
export declare const UI_NEXT_STEP = "ndigo ui add button input field   # copy-in UI components";
//# sourceMappingURL=ui-pointer.d.ts.map