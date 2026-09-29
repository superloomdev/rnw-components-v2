# @superloomdev/rnw-components

One generic component library for React Native Web, React Native and Expo. A component owns its anatomy (which parts exist and how they nest) and its behavior (state, keyboard, focus, accessibility) and nothing else. Every value it draws is a token read from the theme; every discrete shape choice is an enum token the theme picks and the component implements every value of; every glyph is an icon token whose value the theme carries as SVG path data. The library ships no colors, no fonts and no icon files. A template supplies them all and a sparse brand layer overrides a handful, so a new design system is a new template package and zero component changes.

## Installation

```
npm install @superloomdev/rnw-components
```

Peer dependencies: `react`, `react-native`, `react-native-web`, `react-native-svg`, and the Superloom helpers `helper-utils`, `helper-debug`, `helper-themer` (installed under their alias names, see `package.json`).

## Usage

```js
import { createSystem } from '@superloomdev/rnw-components';
import * as factories from '@superloomdev/rnw-components/all';

// `built` is the native projection of a template scheme plus brand layers;
// RNW is itself the web projection, so 'native' is correct on every platform.
const built = shared_libs.Themer.buildTheme(template, layers, 'native');
const Registry = createSystem(shared_libs, config, built, breakpoint, factories);
```

`createSystem` validates the theme against the library's declared token and icon requirements through `Themer.validateContract` and throws one `TypeError` naming every missing token. Components are read from the returned registry by name.

## What this package is

- **Roster-driven**: `data/roster.json` (exported as `./data/roster.json`) is the authoritative list of every component, its tier, family, platform answer, behaviors, enums and flags.
- **Three source tiers**: `component/atom`, `component/molecule`, `component/composite`, plus `component/provider` for context-only components; `behaviors/` holds the headless interaction hooks the components compose.
- **Theme-bound**: no color literal, no unit string, no vendor name and no platform read outside `component/platform.js` in the shipped source; the enforcement gates in `.github/workflows/ci.yml` and the purity tests in `_test/` fail on any of them.

## Documentation

- `ROBOTS.md` - compact signature reference for the entry points
- `docs/authoring.md` - how a component is written, tested and documented
- `DECISIONS.md` - the settled decisions the library is built on
