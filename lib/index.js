/**
 * `create-ndigo-app` — scaffold a standalone Ndigo application.
 */
import { appendFileSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync, writeFileSync, readFileSync, realpathSync, } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { promptChoice, promptLine } from './prompts.js';
import { applyPlan, planTemplate, templateVars } from './templates.js';
import { UI_AGENTS_SECTION, UI_NEXT_STEP, planUiPointer } from './ui-pointer.js';
const VALID_KINDS = ['browser', 'node'];
function parseArgs(argv) {
    const result = { yes: false, local: false, force: false, help: false, version: false };
    let i = 0;
    while (i < argv.length) {
        const token = argv[i];
        if (token === '--kind') {
            result.kind = argv[++i];
        }
        else if (token === '--name') {
            result.name = argv[++i];
        }
        else if (token === '--description') {
            result.description = argv[++i];
        }
        else if (token === '--port') {
            result.port = Number(argv[++i]);
        }
        else if (token === '--dir') {
            result.targetDir = argv[++i];
        }
        else if (token === '--yes' || token === '-y') {
            result.yes = true;
        }
        else if (token === '--local') {
            result.local = true;
        }
        else if (token === '--force') {
            result.force = true;
        }
        else if (token === '--agents') {
            result.agents = true;
        }
        else if (token === '--no-agents') {
            result.agents = false;
        }
        else if (token === '--ui') {
            result.ui = true;
        }
        else if (token === '--no-ui') {
            result.ui = false;
        }
        else if (token === '--help' || token === '-h') {
            result.help = true;
        }
        else if (token === '--version') {
            result.version = true;
        }
        else if (token.startsWith('--')) {
            throw new Error(`Unknown flag: ${token}`);
        }
        else if (result.targetDir === undefined && (token.includes('/') || token.includes('\\\\'))) {
            // A path-like positional is the target directory; the name derives
            // from its basename.
            result.targetDir = token;
        }
        else if (result.name === undefined) {
            result.name = token;
        }
        else {
            throw new Error(`Unexpected argument: ${token}`);
        }
        i++;
    }
    return result;
}
function toKebab(slug) {
    return slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}
function isNonEmpty(dir) {
    if (!existsSync(dir))
        return false;
    return readdirSync(dir).length > 0;
}
function rewriteLocalDeps(targetDir) {
    const manifestPath = join(targetDir, 'package.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const rewrite = (deps) => {
        if (!deps)
            return;
        for (const [name, version] of Object.entries(deps)) {
            if (name.startsWith('@ndigo/') && version === '~0.0.1') {
                // Dev mode: workspace link only resolves when the scaffolded app
                // is a member of this pnpm workspace (see the printed hint).
                // `file:` links cannot be used pre-publish because workspace
                // packages declare `catalog:` specifiers that are only resolved
                // by `pnpm publish` (F-28).
                deps[name] = 'workspace:*';
            }
        }
    };
    rewrite(manifest.dependencies);
    rewrite(manifest.devDependencies);
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}
function addUiDependency(targetDir) {
    const manifestPath = join(targetDir, 'package.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const dependencies = { ...manifest.dependencies, '@ndigo/ui': '~0.0.1' };
    manifest.dependencies = Object.fromEntries(Object.entries(dependencies).sort(([left], [right]) => left.localeCompare(right)));
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}
function printNextSteps(targetDir, kind, agents, ui) {
    console.log(`\nScaffolded ${kind} app at ${targetDir}\n`);
    console.log('Next steps:');
    console.log(`  cd ${targetDir}`);
    console.log('  pnpm install');
    if (kind === 'node') {
        console.log('  pnpm start   # or: pnpm test');
    }
    else {
        console.log('  pnpm dev     # or: pnpm test');
    }
    console.log('  pnpm test');
    if (ui)
        console.log(`  ${UI_NEXT_STEP}`);
    if (!agents)
        console.log('  ndigo ai:init   # add agent context (AGENTS.md + skills)');
}
/**
 * Resolves and constrains a scaffold target directory to the current working
 * directory. Symlinks are rejected, so the resolved path can neither escape the
 * caller's project root nor escape a non-directory target.
 *
 * @param targetDir - User-supplied target path.
 * @returns The canonical absolute target directory.
 * @throws On path escapes, symlinks, and non-directory targets.
 */
function ensureSafeTargetDir(targetDir) {
    const absolute = resolve(targetDir);
    const cwd = process.cwd();
    const relativePath = relative(cwd, absolute);
    if (relativePath.startsWith('..') && relativePath !== '') {
        throw new Error(`create-ndigo-app: target directory must be inside cwd — received ${absolute}`);
    }
    if (existsSync(absolute)) {
        const stat = lstatSync(absolute);
        if (stat.isSymbolicLink()) {
            throw new Error(`create-ndigo-app: refusing to write through a symlink: ${absolute}`);
        }
        if (!stat.isDirectory()) {
            throw new Error(`create-ndigo-app: target directory is a file: ${absolute}`);
        }
        if (realpathSync(absolute) !== absolute) {
            throw new Error(`create-ndigo-app: refusing to scaffold into a reassigned path: ${absolute}`);
        }
    }
    return absolute;
}
/**
 * Scaffolds a standalone Ndigo application.
 *
 * @param argv - The raw CLI arguments (flags + positional name).
 * @returns The process exit code (0 success, 1 runtime failure, 2 usage error).
 *
 * @example
 * ```ts
 * const code = await scaffold(['my-app', '--kind', 'node', '--yes']);
 * process.exitCode = code;
 * ```
 */
export async function scaffold(argv) {
    let parsed;
    try {
        parsed = parseArgs(argv);
    }
    catch (error) {
        console.error(`create-ndigo-app: ${error.message}`);
        return 2;
    }
    if (parsed.help) {
        console.log(`create-ndigo-app — scaffold a standalone Ndigo application

Usage: create-ndigo-app [name|target-dir] [options]

Options:
  --kind <node|browser>   Application kind (default: node, or browser with --ui)
  --name <slug>           App slug (kebab-case)
  --description <text>    One-line description
  --port <n>              Dev port (default: 3000)
  --dir <path>            Target directory
  --yes, -y               Accept defaults without prompting
  --local                 Rewrite @ndigo/* deps to workspace:* links (dev mode)
  --force                 Overwrite a non-empty target directory
  --agents                Write the AGENTS.md agent bootstrap (default: on)
  --no-agents             Skip the agent bootstrap
  --ui                    Add the Ndigo UI design system (browser kind only; default: off)
  --no-ui                 Skip the design-system pointer
  --help, -h              Show this help
  --version               Show version
`);
        return 0;
    }
    if (parsed.version) {
        console.log('create-ndigo-app 0.0.1');
        return 0;
    }
    let name = parsed.name;
    if (process.env.CREATE_NDIGO_APP_LOCAL === '1' || process.env.CREATE_NDIGO_APP_LOCAL === 'true') {
        parsed.local = true;
    }
    if (name === undefined && parsed.targetDir !== undefined) {
        const base = parsed.targetDir.split(/[/\\]/).filter(Boolean).pop() ?? '';
        name = toKebab(base) || 'ndigo-app';
    }
    try {
        if (name === undefined) {
            if (parsed.yes) {
                name = 'ndigo-app';
            }
            else {
                name = await promptLine('App name (kebab-case)', 'ndigo-app');
            }
        }
    }
    catch (error) {
        console.error(`create-ndigo-app: ${error.message}`);
        return 2;
    }
    name = toKebab(name ?? '');
    if (name.length === 0) {
        console.error('create-ndigo-app: an app name is required');
        return 2;
    }
    if (!/^[a-z]/.test(name)) {
        console.error('create-ndigo-app: app name must start with a letter');
        return 2;
    }
    if (parsed.ui === true && parsed.kind === 'node') {
        console.error('create-ndigo-app: --ui requires --kind browser');
        return 2;
    }
    let kind = parsed.kind;
    try {
        if (kind === undefined) {
            if (parsed.ui === true) {
                // `--ui` is browser-only; implying the kind keeps the flag usable
                // on its own instead of erroring on the node default.
                kind = 'browser';
            }
            else if (parsed.yes) {
                kind = 'node';
            }
            else {
                kind = await promptChoice('App kind', ['node', 'browser'], 'node');
            }
        }
    }
    catch (error) {
        console.error(`create-ndigo-app: ${error.message}`);
        return 2;
    }
    if (!VALID_KINDS.includes(kind)) {
        console.error(`create-ndigo-app: --kind must be one of ${VALID_KINDS.join(', ')}`);
        return 2;
    }
    let agents;
    try {
        agents =
            parsed.agents ??
                (parsed.yes
                    ? true
                    : (await promptChoice('Agent context (AGENTS.md)', ['yes', 'no'], 'yes')) === 'yes');
    }
    catch (error) {
        console.error(`create-ndigo-app: ${error.message}`);
        return 2;
    }
    let ui;
    try {
        ui =
            parsed.ui ??
                (kind !== 'browser'
                    ? false
                    : parsed.yes
                        ? false
                        : (await promptChoice('Add the Ndigo UI design system?', ['yes', 'no'], 'no')) === 'yes');
    }
    catch (error) {
        console.error(`create-ndigo-app: ${error.message}`);
        return 2;
    }
    let description;
    try {
        description =
            parsed.description ??
                (parsed.yes
                    ? `${toPascal(name)} — Ndigo demo application`
                    : await promptLine('Description', `${toPascal(name)} — Ndigo demo application`));
    }
    catch (error) {
        console.error(`create-ndigo-app: ${error.message}`);
        return 2;
    }
    const port = parsed.port ?? 3000;
    if (!Number.isInteger(port) || port < 0 || port > 65_535) {
        console.error(`create-ndigo-app: invalid port ${port}`);
        return 2;
    }
    const targetDir = ensureSafeTargetDir(parsed.targetDir ?? `./${name}`);
    if (isNonEmpty(targetDir) && !parsed.force) {
        console.error(`create-ndigo-app: target directory is not empty: ${targetDir} (use --force to overwrite)`);
        return 1;
    }
    if (isNonEmpty(targetDir) && parsed.force) {
        const forbidden = targetDir === '/' ||
            targetDir === resolve(process.env.HOME ?? '/') ||
            targetDir.includes(`${sep}node_modules`) ||
            targetDir.endsWith('.git');
        if (forbidden) {
            console.error(`create-ndigo-app: refusing to overwrite protected path: ${targetDir}`);
            return 1;
        }
        rmSync(targetDir, { recursive: true, force: true });
    }
    mkdirSync(targetDir, { recursive: true });
    const vars = templateVars({
        name,
        kind,
        description,
        port,
        targetDir,
        yes: parsed.yes,
        local: parsed.local,
        force: parsed.force,
        agents,
        ui,
    });
    try {
        const plan = planTemplate(kind, vars);
        if (ui)
            plan.push(...planUiPointer());
        applyPlan(targetDir, plan);
    }
    catch (error) {
        console.error(`create-ndigo-app: ${error.message}`);
        return 1;
    }
    if (!agents) {
        rmSync(join(targetDir, 'AGENTS.md'), { force: true });
    }
    else if (ui) {
        appendFileSync(join(targetDir, 'AGENTS.md'), UI_AGENTS_SECTION, 'utf8');
    }
    try {
        if (ui)
            addUiDependency(targetDir);
        if (parsed.local)
            rewriteLocalDeps(targetDir);
    }
    catch (error) {
        console.error(`create-ndigo-app: ${error.message}`);
        return 1;
    }
    if (parsed.local) {
        console.log('  (dev mode: @ndigo/* rewritten to workspace:* — run pnpm install from the workspace root,');
        console.log('   with this directory added to pnpm-workspace.yaml or placed under apps/.)');
    }
    printNextSteps(targetDir, kind, agents, ui);
    return 0;
}
function toPascal(slug) {
    return slug
        .split(/[-_]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxPQUFPLEVBQ0gsY0FBYyxFQUNkLFVBQVUsRUFDVixTQUFTLEVBQ1QsU0FBUyxFQUNULFdBQVcsRUFDWCxNQUFNLEVBQ04sYUFBYSxFQUNiLFlBQVksRUFDWixZQUFZLEdBQ2YsTUFBTSxTQUFTLENBQUM7QUFDakIsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN4RCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR2pGLE1BQU0sV0FBVyxHQUF1QixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQWlCNUQsU0FBUyxTQUFTLENBQUMsSUFBYztJQUM3QixNQUFNLE1BQU0sR0FBZSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQ25HLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNyQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQVks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