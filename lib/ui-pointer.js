/** The pointer file, matching `ndigo ui init` byte for byte. */
export const UI_CONFIG_FILE = 'ndigo.ui.json';
/** The application stylesheet that carries the token import. */
export const UI_STYLESHEET = 'src/styles.css';
/**
 * The `ndigo.ui.json` payload — the same schema, registry default, and alias
 * table `ndigo ui init` writes.
 *
 * @returns The pointer file content, newline-terminated.
 */
export function uiConfig() {
    const payload = {
        $schema: 'https://ndigo.dev/schema/ndigo.ui.json',
        registry: 'https://ndigo.dev/r/registry.json',
        aliases: {
            ui: 'src/ui',
            lib: 'src/lib',
            components: 'src/components',
            hooks: 'src/hooks',
        },
    };
    return `${JSON.stringify(payload, null, 2)}\n`;
}
/**
 * The entry stylesheet: the canonical `--nd-*` tokens, imported from the
 * package rather than copied in. The registry's `theme` item is the copy-in
 * alternative; an application uses one or the other, never both.
 *
 * @returns The stylesheet content.
 */
export function uiStylesheet() {
    return `/* Ndigo design tokens (--nd-*). Components install with \`ndigo ui add <item>\`. */\n@import '@ndigo/ui/tokens.css';\n`;
}
/**
 * Resolves the pointer files for a `--ui` scaffold.
 *
 * @returns The planned `ndigo.ui.json` and `src/styles.css` entries.
 */
export function planUiPointer() {
    return [
        { destination: UI_CONFIG_FILE, content: uiConfig() },
        { destination: UI_STYLESHEET, content: uiStylesheet() },
    ];
}
/**
 * The AGENTS.md section appended when an agent bootstrap and the design system
 * are both requested. It is scaffold-time content, not part of the managed
 * `tools/agent-content/` block the CLI owns.
 */
export const UI_AGENTS_SECTION = `
## Design system

This app uses the Ndigo design system. \`src/styles.css\` imports the \`--nd-*\`
tokens from \`@ndigo/ui\`; style with those tokens (\`var(--nd-color-surface)\`,
\`var(--nd-space-4)\`) rather than literal values. Components install as copy-in
source with \`ndigo ui add <item>\` (see \`ndigo ui list\`); \`ndigo.ui.json\`
records the registry and the \`@ui\`/\`@lib\`/\`@components\`/\`@hooks\` aliases.
`;
/**
 * The next-steps hint printed when the pointer is written. Names a component
 * item, not `theme`: the token import already covers the theme layer.
 */
export const UI_NEXT_STEP = 'ndigo ui add button input field   # copy-in UI components';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWktcG9pbnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91aS1wb2ludGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLGdFQUFnRTtBQUNoRSxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsZUFBZSxDQUFDO0FBRTlDLGdFQUFnRTtBQUNoRSxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUM7QUFFOUM7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsUUFBUTtJQUNwQixNQUFNLE9BQU8sR0FBRztRQUNaLE9BQU8sRUFBRSx3Q0FBd0M7UUFDakQsUUFBUSxFQUFFLG1DQUFtQztRQUM3QyxPQUFPLEVBQUU7WUFDTCxFQUFFLEVBQUUsUUFBUTtZQUNaLEdBQUcsRUFBRSxTQUFTO1lBQ2QsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixLQUFLLEVBQUUsV0FBVztTQUNyQjtLQUNKLENBQUM7SUFDRixPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDbkQsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxZQUFZO0lBQ3hCLE9BQU8seUhBQXlILENBQUM7QUFDckksQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsYUFBYTtJQUN6QixPQUFPO1FBQ0gsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRTtRQUNwRCxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFO0tBQzFELENBQUM7QUFDTixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHOzs7Ozs7OztDQVFoQyxDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLDJEQUEyRCxDQUFDIn0=