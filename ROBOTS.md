# ROBOTS.md - rnw-components

## Type

Component library, ESM, `exports` only (no `main`). Entry `.` exports the named factory `createSystem` and the declared requirement data; `./all` exports one component factory per roster row whose `status` is not `not_applicable`; `./data/roster.json` is the machine-readable roster.

## Peer dependencies

`react >=18`, `react-native >=0.86.0`, `react-native-web >=0.21.0`, `react-native-svg >=15.0.0`, `helper-utils ^1.0.0`, `helper-debug ^1.0.0`, `helper-themer ^1.0.0`. React, the helpers and the Themer engine reach components through `shared_libs`; nothing under `component/` or `behaviors/` imports them directly.

## Entry points

- `createSystem(shared_libs, config, built, breakpoint, factories)` -> `Registry` - validates `built` against `REQUIRED_TOKENS` and `REQUIRED_ICONS` through `Themer.validateContract` (one `TypeError` naming every missing token), builds the component context and registers every factory in `factories`.
- `REQUIRED_TOKENS`, `SUPPORTED_TOKENS`, `REQUIRED_ICONS` - exported data; the union of what the components read.

## Component factory shape

`export default function Name (ctx) { return function Name (props) { ... } }` - the outer function receives the component context (`ctx.metric`, `ctx.color`, `ctx.token`, `ctx.typeStyle`, `ctx.focusPresentation`, `ctx.enum`, `ctx.icon`, `ctx.Registry`), the inner function is the React component.

## Exports

- `.` -> `./components.js`
- `./all` -> `./all.js`
- `./data/roster.json` -> `./data/roster.json`
- `./package.json` -> `./package.json`
