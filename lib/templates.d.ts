import type { AppKind, PlannedFile, ScaffoldOptions } from './types.js';
/**
 * Absolute path to the templates root shipped with the package.
 *
 * @returns The absolute `templates/` directory.
 */
export declare function templatesRoot(): string;
/**
 * Absolute path to the template directory for a kind.
 *
 * @param kind - The application kind.
 * @returns The absolute template directory for `kind`.
 */
export declare function kindTemplateDir(kind: AppKind): string;
/**
 * Substitution variables derived from the scaffold options.
 *
 * @param options - The scaffold options.
 * @returns The `{{key}}` substitution map.
 */
export declare function templateVars(options: ScaffoldOptions): Record<string, string | number>;
/**
 * Replaces `{{key}}` placeholders; unknown keys are left untouched.
 *
 * @param content - The template content.
 * @param vars - The substitution map.
 * @returns The content with known placeholders replaced.
 */
export declare function substitute(content: string, vars: Record<string, string | number>): string;
/**
 * Resolves the template tree for a kind into a file plan, applying `{{...}}`
 * substitution to file contents and `__name__` substitution to file names.
 * Strips a trailing `.template` suffix. Reads only; writes nothing.
 *
 * @param kind - The application kind whose template tree is planned.
 * @param vars - The `{{key}}` substitution map.
 * @returns One entry per template file, in directory order.
 */
export declare function planTemplate(kind: AppKind, vars: Record<string, string | number>): PlannedFile[];
/**
 * Writes a resolved plan into `targetDir`, creating directories as needed.
 *
 * @param targetDir - The destination directory.
 * @param plan - The resolved file plan.
 * @returns Nothing; writes the plan to disk.
 */
export declare function applyPlan(targetDir: string, plan: readonly PlannedFile[]): void;
//# sourceMappingURL=templates.d.ts.map