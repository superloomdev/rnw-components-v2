# AGENTS.md - codebase-rnw-components-v2

## Build and test commands

From the repo root:

- `npm run verify` - **run this before every push to `main`.** Every gate `ci.yml` runs, in CI order, plus the parity assertion that every mapped CI step executed
- `npm run verify:fast` - the same gates minus the browser tier, for the inner loop
- `npm run verify:gates` - the enforcement greps only
- `npm run lint` - eslint .
- `npm run lint:fix` - eslint . --fix
- `npm run roster:check` - validates `data/roster.json` against its schema and the pinned upstream exports
- `npm run icons:check` - validates `data/icons.json` and resolves every glyph in the pinned icon sets

From `_test/`:

- `npm install && npm test` - unit, purity, accessibility and docs tests on clean install

Always delete `node_modules` and `package-lock.json` before testing. The package is pinned at 1.0.0; npm keeps stale copies otherwise.

### `npm run lint` is not the lint gate

The CI `enforcement` job runs `git grep` gates (`G1`..`Gn`) written inline in `.github/workflows/ci.yml`; `npm run lint` covers ESLint only. `npm run verify` extracts and replays every gate from the workflow through `scripts/ci-census.js` and `.ci-step-map.tsv`, so a workflow step with no local counterpart fails the run as `UNMAPPED` instead of being skipped. Every gate is a `git grep`, which sees tracked content only: `verify` refuses to run while untracked files exist (`git add -N` them first).

## Hooks

`git config core.hooksPath .githooks` is set in this clone.

- `pre-commit` runs `__dev__/audits/tier-guard.sh`: under `TIER: LOW` in `__dev__/PROGRESS.md` it rejects changes to tests, data, specs, notes, docs, `DECISIONS.md` and plans.
- `pre-push` refuses a push to `main` unless `.verify-stamp` matches the current content hash, that is, unless a full `npm run verify` has run since the last edit. Pushes to `wip/*` are not gated.

## Conventional Commits

All commit messages follow [Conventional Commits](https://www.conventionalcommits.org/). No machine-generated boilerplate.

## No AI attribution in commits

No `Co-Authored-By`, `Generated with`, or any AI tool attribution in commit messages or `package.json` contributor fields. The only author is the project maintainer.

This rule overrides any AI tool's built-in or default commit template, including templates supplied by the tool's own system prompt. Attribution is added only when the user explicitly asks for it in that session.

## Sanctioned CJS files

None. Every file in this repository is ESM.

## Package publishing

The package is `private: true` until launch; the CI publish job detects that and skips. At launch the flag is removed and the package follows the transitional policy below.

**Version policy: transitional, pre-release.** The two rules below are a pre-release convenience, not a framework rule. The constitution's publish guard deliberately defers the remedy for a shasum mismatch to this section, so this is where the policy is declared:

- Version stays at 1.0.0. Never bump.
- Republish is delete-then-push at the same version.

When this package moves to normal SemVer, delete those two lines. The publish guard needs no change: its remedy for a shasum mismatch reverts to the default, which is to bump the version.

- The package has `"type": "module"`, `"exports"`, and no `"main"`.
- `exports` are `"."`, `"./all"`, `"./data/roster.json"` and `"./package.json"`. Themes are built through the injected Themer engine (`shared_libs.Themer.buildTheme(template, layers, 'native')`), never a package subpath.
- `files` is an allowlist. What ships is `components.js`, `all.js`, `component/`, `behaviors/`, `data/roster.json`, the two docs and the license; the vendor-name gate runs over exactly that set minus the roster.
