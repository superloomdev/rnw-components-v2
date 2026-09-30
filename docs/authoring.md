# Authoring a component

This is the briefing an author reads before writing or fixing a component (the `/rnw-component add <Name>` and `/rnw-component fix <Name>` workflow walks it phase by phase), together with `DECISIONS.md`, the batch's roster rows, `behaviors/ROBOTS.md`, one exemplar folder (`component/atom/icon/`), the current defects list and the contact sheet. Nothing else is required reading.

## What a component is

A component owns its **anatomy** (which parts exist and how they nest) and its **behavior** (state, keyboard, focus, accessibility, composed from `behaviors/`). It owns nothing else. Every value it draws is a token read through `ctx`; every discrete shape choice is an enum token the theme picks and the component implements every value of; every glyph is an `Icon` with a semantic name. A component contains no color literal, no unit string, no vendor name, no framework import and no platform read.

## Files

```
component/<tier>/<family>/<name>.js          the factory (required)
component/<tier>/<family>/<name>.web.js      web half, only for rows whose platform answer is `split`
component/<tier>/<family>/<name>.native.js   native half, same
component/<tier>/<family>/api.js             props, kinds, variants, tokens, colors - as data
component/<tier>/<family>/spec.js            metric name -> token rule
component/<tier>/<family>/sample.js          the states row: label + props per rendered instance
component/<tier>/<family>/reference.js       upstream mount + part selectors (rows with a reference)
component/<tier>/<family>/notes.md           vendor-free prose: decisions, flags explained, platform notes
_test/<name>.test.js                         unit + accessibility tests for this component
```

`<tier>` is one of `atom`, `molecule`, `composite`, `provider` (gate G8). A family folder may hold several components (`button/button.js`, `button/icon-button.js`): the first keeps `api.js`, `spec.js`, `sample.js`, `reference.js`, each further one names its data files by its stem (`api.icon-button.js`, `spec.icon-button.js`, ...), and the family shares `notes.md`. `scripts/lib/components.js` discovers components by these file names.

## The factory

```js
import SPEC from './spec.js';

export default function Name (ctx) {

  const React = ctx.React;
  const { View, Text, Pressable } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;

  function NameComponent (props) {
    ...
    return React.createElement(View, { style: { height: ctx.metric('Name', 'height') } }, ...);
  }

  NameComponent.displayName = 'Name';
  return NameComponent;

}

Name.spec = SPEC;
```

- The outer function runs once per system and receives `ctx`; the inner function is the React component. Attach `spec` to the factory: `createSystem` reads it.
- No JSX: the Node tests load library source directly. Use `React.createElement`.
- Other components come from `ctx.Registry.<Name>` at render time, never by import. Atoms compose no library component.
- `react-native-svg` is `ctx.Svg` and only `Icon` touches it.

## The context (`ctx`)

| Read | Returns | Throws when |
|---|---|---|
| `ctx.token('spacing.spacing_05')` | the emitted value | the theme lacks it |
| `ctx.color('interactive')` | `color.interactive` | same |
| `ctx.typeStyle('body01')` | `{ fontFamily, fontSize, fontWeight, letterSpacing, lineHeight }` with the family token resolved | same |
| `ctx.metric('Name', 'height')` | the spec entry resolved | no sheet, no metric, bad rule |
| `ctx.enum('anatomy.label')` | the theme's choice, checked against the contract's list | not an enum, value outside the list |
| `ctx.icon('close', 16)` | `{ viewBox, paths }`; the set's own 16px glyph when it has one | the theme lacks the icon |
| `ctx.focusPresentation(focused)` | style fragment for the theme's `feedback.focus` mode | - |
| `ctx.pressPresentation(state, palette)` | `{ container, layer, engaged }` for the theme's `feedback.press` mode; `palette` is `{ rest, hover, active, content }` color leaves (`null` fill = none); `engaged` is true while a highlight fill replaces the rest fill | a leaf the theme lacks |
| `ctx.fieldPresentation(state, options)` | `{ root, frame, label, raised, placeholder }` for the theme's `feedback.field` frame and `anatomy.label` placement; `options` is `{ height, paddingInline, radius, surface, disabledBorder }` (`disabledBorder` a color leaf, `border_disabled` by default, `null` for none) | a leaf the theme lacks |

A component that shows press or a field frame uses the presentation, never its own branch on the enum, and always mounts the parts a presentation may hide (the state layer, the label), so the element tree and the accessibility tree are the same under every template. The tokens a presentation reads are declared in the calling component's `api.tokens`.

Also on `ctx`: `React`, `ReactNative`, `Svg`, `Utils`, `Debug`, `Registry`, `behaviors`, `breakpoint`, `platform` (`{ os, isNative, split }`), `config`.

## Spec sheet (`spec.js`)

A frozen object, metric name to rule:

```js
export default Object.freeze({
  height: 'size.size_medium',                                                 // a token name
  inner: { tokens: ['size.size_medium', 'border.width_01'], operation: 'subtract' },  // derived
  handleOffset: { constant: 3 }                                               // a decision, roster flag superloom_decision
});
```

Every token named here must be in `component/contract.js` (`REQUIRED_TOKENS`); a color leaf a component may read optionally goes to `SUPPORTED_TOKENS`; an icon a component draws on its own initiative goes to `REQUIRED_ICONS`. The purity test asserts the lists equal the union of what the sheets and `api.js` files declare.

## Enums

For every enum in the roster row, implement every value the contract lists (`Themer.getContract().tokens['anatomy.label'].values`), as an exhaustive branch on `ctx.enum(name)`. The `enum-render` test renders the component under each value and asserts the render changes. Name nothing after a design system: the values are `above` / `floating`, `fixed` / `grows`, never a vendor.

## Platform

Read the platform only through `ctx.platform`. A row whose platform answer is `both` needs one file. A row whose answer is `split` has `<name>.web.js` and `<name>.native.js` exporting the same factory signature, and `<name>.js` dispatches: `ctx.platform.split({ web: WebHalf, native: NativeHalf })` and renders `null` when the half is missing (the roster's `fallback` column says what "missing" means for the row). `Platform.OS` anywhere else is gate G4's failure.

## Accessibility

`aria-*` props only, plus `accessibilityRole` and `accessibilityLabel`; never `accessibilityState`, `accessibilityValue`, `accessibilityHint`, `accessibilityViewIsModal`, `importantForAccessibility` (gate G1). Translate semantic state through `ctx.behaviors.getA11yState` and friends. The `a11y-identity` test asserts the accessibility tree is identical under all three templates: a theme changes how a thing looks, never what it is.

## Sample (`sample.js`)

A frozen array of `{ label, props }`. It drives the showcase states row, the browser gates (structural, measurement, perceptual), the docs page and the contact sheet. Cover: default, every enum value that changes the render, disabled, invalid where applicable, and the extremes (`small` / `large`).

## Reference (`reference.js`) - rows with `reference.kind != none`

```js
export default Object.freeze({
  kind: 'render-web',            // from the roster row
  mount: function (React, upstream, props) { ... },   // the upstream element for the same props, or null when the state has no counterpart
  body: Object.freeze({ width: 320 }),                // optional: a component that fills its container is measured in a body this wide
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"]', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"] > [dir="auto"]', measure: 'text' }),
    box: Object.freeze({ upstream: '.cds--checkbox-label', pseudo: '::before', ours: '...', measure: 'box' })
  })
});
```

The reference page (`_test/harness/reference-entry.js`) mounts every state through `mount`: `render-web` rows under the upstream stylesheet, `parse-rn` rows through react-native-web so the upstream's published style objects are what is drawn. `upstream` is the upstream module plus `icon(name)`, which resolves a semantic icon name to the upstream's icon component. The measurement gate (`measure.spec.js`) finds each part by its selector on both pages, within the cell body, and compares: for `box` parts the rect relative to the body, border widths, corner radius, fill, border color where a border is drawn, and any drawn outline; for `text` parts the rect of the element's own text nodes, its first font family and its text style; for `type` parts the text style only. An upstream part drawn on a pseudo-element names it in `pseudo`. Numbers agree within half a pixel, colors and families exactly; every part must be drawn upstream in some state. Measure what is painted, not the mechanism: select an icon's `path`, not its `svg` box. The perceptual gate compares the same cell bodies pixel by pixel. Stylesheet transcription is not evidence; the rendered upstream is.

## Notes (`notes.md`)

Vendor-free prose. Required when the row carries a flag that demands an explanation (`deferred_gap`, `no_reference`, `superloom_decision`, `web_only`, `requires_parent`). Say what was decided and why, and what the platform answer means for the row. The docs generator merges it into the family's page.

## Verification

- `npm run check -- <Name>` after every edit: lint on the changed files, purity scan, this component's tests.
- `npm run batch` at batch close (LOW): everything, plus browser gates, screenshots, docs regeneration and the defects list.
- `npm run verify` before any push to `main`.

## Layer-4 review checklist (HIGH, contact sheet)

For each family, ours beside the reference under the three templates and every state:

1. Anatomy: the same parts exist and nest the same way; nothing missing, nothing extra.
2. Geometry: sizes, paddings, radii and borders match the reference within the row's budget; text does not clip or wrap unexpectedly.
3. Color: every surface, text and border reads from the template (no gray where the template says brand, no brand where it says neutral).
4. Type: family, size, weight and line height match the template's type set for the part.
5. States: default, hover, focus, pressed, disabled, invalid each visibly distinct and consistent across the family.
6. Enums: each enum value renders as its name says (a `floating` label floats; a `grows` handle grows).
7. Icons: the set matches the template; sizes align to the text they sit beside; decorative icons carry no label.
8. Cross-template: the accessibility tree and the element structure are identical; only appearance differs.
9. Brand layer: the `acme` layer's color, family, radii and icon overrides reach the render.
10. Nothing vendor-specific leaked into a generic row (a shape only one system has, without a roster flag).

A finding becomes a `__dev__/DEFECTS.md` row (script-generated from the verdict JSON) and, where a machine could have caught it, a new rule in gate layers 1-3.
