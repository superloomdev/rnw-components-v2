# Removed Superloom passages - Material retirement

On 2026-10-28 every trace of the Material design system, its template package
and the second-reference concept was removed from the Superloom framework
repository (`codebase-superloom`). Each entry below names `path:line` at the
commit the removal was made from (`43abd48`), quotes the original passage
verbatim, and gives the replacement text (or `deleted`). Restoring a passage
means putting the original block back at that location.

## AGENTS.md

### AGENTS.md:74

Original:

```text
- **Two templates ship, `carbon` and `default`; the Material template is archived:** frozen on the registry at `1.0.0`, never regenerated, republished, rendered or measured; component references carry no second (Material) block; the behavior values it taught stay enum values any template or brand layer may pin. See `docs/languages/js/client/theming.md` - Themes, templates, layers, profiles
```

Replacement:

```text
- **Two templates ship, `carbon` and `default`:** behavior values such as a floating label or ripple are enum values any template or brand layer may pin. See `docs/languages/js/client/theming.md` - Themes, templates, layers, profiles
```

## docs/languages/js/client/theming.md

### theming.md:62

Original:

```text
- A **profile** is a named, versioned set of reference templates with identity: `{ id, contract_version, reference, schemes }`. `js-client-helper-themer-template-carbon` is a profile with four schemes. Two templates ship, `carbon` and `default`. The Material template (`js-client-helper-themer-template-material`) is archived: it is frozen on the registry at `1.0.0` and is never regenerated, republished, rendered or measured, and component references carry no second block measured against it. The behavior values it taught (a floating label, a ripple, a growing switch handle and the others) stay enum values that any template or brand layer may pin.
```

Replacement:

```text
- A **profile** is a named, versioned set of reference templates with identity: `{ id, contract_version, reference, schemes }`. `js-client-helper-themer-template-carbon` is a profile with four schemes. Two templates ship, `carbon` and `default`. Behavior values such as a floating label, a ripple and a growing switch handle are enum values that any template or brand layer may pin.
```

### theming.md:122

Original:

```text
Generated packages prevent this by recording source provenance in their metadata: the default package version, the default distribution shasum, and the generator schema revision. A generator check compares the installed default shasum against the registry shasum and refuses to write on mismatch. A generated-artifact test regenerates into a temporary directory and byte-compares every committed data file against the regeneration output. After a same-version default republish, every shipped downstream generated package is regenerated and republished at the same version (archived templates are excluded), and every consumer lockfile is refreshed. Generated icon values carry the same provenance: the upstream icon package name and version, and a regenerate-and-diff test.
```

Replacement:

```text
Generated packages prevent this by recording source provenance in their metadata: the default package version, the default distribution shasum, and the generator schema revision. A generator check compares the installed default shasum against the registry shasum and refuses to write on mismatch. A generated-artifact test regenerates into a temporary directory and byte-compares every committed data file against the regeneration output. After a same-version default republish, every shipped downstream generated package is regenerated and republished at the same version, and every consumer lockfile is refreshed. Generated icon values carry the same provenance: the upstream icon package name and version, and a regenerate-and-diff test.
```

### theming.md:124

Original:

```text
Template updates follow one procedure, contract first. The contract is defined before any component is written; during component work, a token the contract lacks is queued as a contract request and never invented locally; at a milestone the queued requests are applied as one contract version bump, every shipped template is regenerated and republished in dependency order (engine, default, then each shipped reference template; archived templates are excluded), and every consumer is revalidated. A wrong template *value* found by measurement follows the same path: template fix, regenerate, republish.
```

Replacement:

```text
Template updates follow one procedure, contract first. The contract is defined before any component is written; during component work, a token the contract lacks is queued as a contract request and never invented locally; at a milestone the queued requests are applied as one contract version bump, every shipped template is regenerated and republished in dependency order (engine, default, then each shipped reference template), and every consumer is revalidated. A wrong template *value* found by measurement follows the same path: template fix, regenerate, republish.
```

### theming.md:130

Original:

```text
Motion has two halves. Curves and timings are data tokens: durations in milliseconds, and curves of three kinds, a **bezier** (`[x1, y1, x2, y2]`), a **spring** (`{ spring: true, stiffness, damping, mass }`), and **segments** (`{ segments: true, curves: [[t, [x1, y1, x2, y2]], ...] }`, an ordered list of beziers with split points). Every curve in Carbon and Material is one of the three, and both platforms render all three: React Native through `Easing.bezier`, `Animated.spring`, and a sequenced bezier list; the web through `cubic-bezier()` and `linear()`.
```

Replacement:

```text
Motion has two halves. Curves and timings are data tokens: durations in milliseconds, and curves of three kinds, a **bezier** (`[x1, y1, x2, y2]`), a **spring** (`{ spring: true, stiffness, damping, mass }`), and **segments** (`{ segments: true, curves: [[t, [x1, y1, x2, y2]], ...] }`, an ordered list of beziers with split points). Every curve in Carbon is one of the three, and both platforms render all three: React Native through `Easing.bezier`, `Animated.spring`, and a sequenced bezier list; the web through `cubic-bezier()` and `linear()`.
```

### theming.md:136

Original:

```text
Discrete behaviors that design systems answer differently are enum tokens, and the component system implements every listed value: `feedback.press` selects `highlight` (swap to hover and active colors), `opacity` (paint a state layer at `state.*` opacities), or `ripple` (radial spread from the touch point); `feedback.focus_trigger` selects `any` or `keyboard` (whether a focus ring shows on every focus or on keyboard focus only; its width, offset and color are role-grid cells). Stacking magnitudes are structure tokens: the `stacking.*` group (contract version 3) names the five ordered surfaces (`dropdown`, `modal`, `header`, `overlay`, `floating`) and each template supplies the numbers its design system publishes: Carbon's z-index utility map, or the default template's value when the system orders by elevation instead, as Material does. Which surface a component occupies stays in the component library, not in a token.
```

Replacement:

```text
Discrete behaviors that design systems answer differently are enum tokens, and the component system implements every listed value: `feedback.press` selects `highlight` (swap to hover and active colors), `opacity` (paint a state layer at `state.*` opacities), or `ripple` (radial spread from the touch point); `feedback.focus_trigger` selects `any` or `keyboard` (whether a focus ring shows on every focus or on keyboard focus only; its width, offset and color are role-grid cells). Stacking magnitudes are structure tokens: the `stacking.*` group (contract version 3) names the five ordered surfaces (`dropdown`, `modal`, `header`, `overlay`, `floating`) and each template supplies the numbers its design system publishes: Carbon's z-index utility map, or the default template's value when the system orders by elevation instead, as some design systems do. Which surface a component occupies stays in the component library, not in a token.
```

## docs/languages/js/client/components.md

### components.md:123

Original:

```text
A component that needs a token the contract lacks does not invent one and does not stop the batch. The request (token, requesting row, reason) is queued and applied at the next milestone as one contract version bump, followed by regeneration and republication of every shipped template in dependency order (archived templates are excluded) and revalidation of every consumer. Never mid-batch, never one token at a time.
```

Replacement:

```text
A component that needs a token the contract lacks does not invent one and does not stop the batch. The request (token, requesting row, reason) is queued and applied at the next milestone as one contract version bump, followed by regeneration and republication of every shipped template in dependency order and revalidation of every consumer. Never mid-batch, never one token at a time.
```

### components.md:267

Original:

```text
| **Hit target** | Minimum 44x44 points on interactive components (iOS HIG), 48x48 dp (Android Material) |
```

Replacement:

```text
| **Hit target** | Minimum 44x44 points on interactive components (iOS HIG), 48x48 dp (Android) |
```

## docs/languages/js/client/rn-testing.md

### rn-testing.md:325

Original:

```text
- Material 3 official type scale is the authority for Material role values.
```

Replacement: `deleted`

## docs/languages/js/publishing.md

### publishing.md:171

Original:

```text
A generated reference theme package (e.g., Carbon) completes its schemes from the default template at generation time. When the default template is republished at the same version with corrected values, the generated package must be regenerated and republished at the same version (archived templates are excluded). The procedure:
```

Replacement:

```text
A generated reference theme package (e.g., Carbon) completes its schemes from the default template at generation time. When the default template is republished at the same version with corrected values, the generated package must be regenerated and republished at the same version. The procedure:
```

## docs/languages/js/testing-strategy.md

### testing-strategy.md:257

Original:

```text
- **Generated reference theme packages record source provenance and verify it at test time.** A generated package (e.g., Carbon) records the default package version, default distribution shasum, and generator schema revision in its metadata. Tests fail when the installed default shasum does not match the registry shasum, when provenance is stale or missing, or when regeneration into a temporary directory is not byte-identical to the committed data files. Exact type-role values (size, line height, weight, tracking, family) are package contract tests asserted with `deepEqual`. After a same-version default republish, every shipped downstream generated package is regenerated and republished (archived templates are excluded), and every consumer lockfile is refreshed. See [Theming - Generated artifact provenance](client/theming.md#generated-artifact-provenance).
```

Replacement:

```text
- **Generated reference theme packages record source provenance and verify it at test time.** A generated package (e.g., Carbon) records the default package version, default distribution shasum, and generator schema revision in its metadata. Tests fail when the installed default shasum does not match the registry shasum, when provenance is stale or missing, or when regeneration into a temporary directory is not byte-identical to the committed data files. Exact type-role values (size, line height, weight, tracking, family) are package contract tests asserted with `deepEqual`. After a same-version default republish, every shipped downstream generated package is regenerated and republished, and every consumer lockfile is refreshed. See [Theming - Generated artifact provenance](client/theming.md#generated-artifact-provenance).
```

## docs/languages/js/pitfalls-migration.md

### pitfalls-migration.md:413

Original:

```text
**Symptom:** A base template package is republished with corrected typography (replacing step-based type sets with explicit `font_size` and `line_height_px`). Consumer clean installs pick up the new base artifact, but a generated downstream profile package (e.g., Material) retains the old step-based values for contract keys that were completed from the base rather than mapped explicitly. The browser renders a `caption02` token at 42px/60px instead of 14px/18px, producing a 300px banner and a 762px page. Presence-only E2E tests pass because the text is present and the interaction works.
```

Replacement:

```text
**Symptom:** A base template package is republished with corrected typography (replacing step-based type sets with explicit `font_size` and `line_height_px`). Consumer clean installs pick up the new base artifact, but a generated downstream profile package (e.g., Carbon) retains the old step-based values for contract keys that were completed from the base rather than mapped explicitly. The browser renders a `caption02` token at 42px/60px instead of 14px/18px, producing a 300px banner and a 762px page. Presence-only E2E tests pass because the text is present and the interaction works.
```

## docs/dev/pitfalls.md

### pitfalls.md:116 (table of contents line for entry 70)

Original:

```text
  - [70. A primary-reference layout choice hard-coded where the second reference has no counterpart](#_70-a-primary-reference-layout-choice-hard-coded-where-the-second-reference-has-no-counterpart)
```

Replacement:

```text
  - [70. A primary-reference layout choice hard-coded where the web-component reference has no counterpart](#_70-a-primary-reference-layout-choice-hard-coded-where-the-web-component-reference-has-no-counterpart)
```

### pitfalls.md:1508 (entry 50, Symptom)

Original:

```text
**Symptom:** Every icon rendered, no console error, every zero-error gate green - and the Material theme showed Carbon's glyphs on every component, for weeks.
```

Replacement:

```text
**Symptom:** Every icon rendered, no console error, every zero-error gate green - and the second theme showed Carbon's glyphs on every component, for weeks.
```

### pitfalls.md:1512 (entry 50, Evidence)

Original:

```text
**Evidence:** The icon manifest carried a Carbon column and a legacy column, no Material column; both host adapters imported the Carbon icon package. A notification under the Material theme drew Material colors around IBM's 32-grid warning triangle.
```

Replacement:

```text
**Evidence:** The icon manifest carried a Carbon column and a legacy column but none for the second theme; both host adapters imported the Carbon icon package. A notification under the second theme drew the second theme's colors around IBM's 32-grid warning triangle.
```

### pitfalls.md:1592 (entry 58, Symptom)

Original:

```text
**Symptom:** The second-reference measurement of a floating label reported fractional positions that changed between runs (`y: -4.68`, then `13.24`), a slotted label's text style as the page body's, and a grouped selector that matched nothing.
```

Replacement:

```text
**Symptom:** The web-component reference's measurement of a floating label reported fractional positions that changed between runs (`y: -4.68`, then `13.24`), a slotted label's text style as the page body's, and a grouped selector that matched nothing.
```

### pitfalls.md:1614 (entry 60, Cause)

Original:

```text
**Cause:** Four defects, three of them on the side treated as the reference. The web host's committed IBM Plex Sans files were HTML pages saved under `.ttf` names, so the browser drew a fallback face; the font check passed because it compared token names, not what the browser loaded. The web walker measured before its declared faces finished loading, so even Roboto was measured in the fallback. Neither host carried the mono families, so code text was drawn in each platform's own system monospace. And the one real component defect: the field and select grew from `flex: 1`, a zero basis in native layout, so in a container sized to its content they collapsed to their padding, while a browser input's intrinsic width hid it on the web.
```

Replacement:

```text
**Cause:** Four defects, three of them on the side treated as the reference. The web host's committed IBM Plex Sans files were HTML pages saved under `.ttf` names, so the browser drew a fallback face; the font check passed because it compared token names, not what the browser loaded. The web walker measured before its declared faces finished loading, so even the second template's family was measured in the fallback. Neither host carried the mono families, so code text was drawn in each platform's own system monospace. And the one real component defect: the field and select grew from `flex: 1`, a zero basis in native layout, so in a container sized to its content they collapsed to their padding, while a browser input's intrinsic width hid it on the web.
```

### pitfalls.md:1623 (entry 61, Symptom)

Original:

```text
**Symptom:** After the web baseline drew its real fonts, the native gate still failed Android on monospace (91pt where the web measured 122pt) and on a few labels, and a percentage allowance seemed needed for short strings. Android widths were identical under the IBM Plex and the Roboto templates; iOS widths differed between them as the web's did.
```

Replacement:

```text
**Symptom:** After the web baseline drew its real fonts, the native gate still failed Android on monospace (91pt where the web measured 122pt) and on a few labels, and a percentage allowance seemed needed for short strings. Android widths were identical under IBM Plex Sans and the second template's family; iOS widths differed between them as the web's did.
```

### pitfalls.md:1625 (entry 61, Cause)

Original:

```text
**Cause:** Two platform behaviors. The runtime font loader registers each face under an alias (`IBM Plex Sans_normal`), and Android resolves a `fontFamily` only by registered name, so it drew its system Roboto for every theme family; iOS resolves the family name inside the font file, so it worked there, and sans hid the fault because Plex Sans and Roboto are within a few points of each other. Separately, Chromium on Linux hints glyph advances to whole pixels by default, so the CI web walker measured `Error text` at 63px where the font's own advances give 65.19px, which macOS, iOS and Android all draw.
```

Replacement:

```text
**Cause:** Two platform behaviors. The runtime font loader registers each face under an alias (`IBM Plex Sans_normal`), and Android resolves a `fontFamily` only by registered name, so it drew its system sans for every theme family; iOS resolves the family name inside the font file, so it worked there, and sans hid the fault because Plex Sans and the system sans are within a few points of each other. Separately, Chromium on Linux hints glyph advances to whole pixels by default, so the CI web walker measured `Error text` at 63px where the font's own advances give 65.19px, which macOS, iOS and Android all draw.
```

### pitfalls.md:1657 (entry 65, Symptom)

Original:

```text
**Symptom:** The checkbox box was drawn 3px left and 1px above the reference's box, the second reference's error colors never matched, and a disabled label compared as white: all with a passing or misleading measurement.
```

Replacement:

```text
**Symptom:** The checkbox box was drawn 3px left and 1px above the reference's box, the web-component reference's error colors never matched, and a disabled label compared as white: all with a passing or misleading measurement.
```

### pitfalls.md:1659 (entry 65, Cause)

Original:

```text
**Cause:** The harness read a positioned pseudo-element at its offset but not its margin; themed the second reference only with the colors the template's mapping table named, so every other system color fell back to the component's own defaults; and read a slotted label's style from the wrong shadow element and its opacity along the light-DOM parent rather than the slot it renders in.
```

Replacement:

```text
**Cause:** The harness read a positioned pseudo-element at its offset but not its margin; themed the web-component reference only with the colors the template's mapping table named, so every other system color fell back to the component's own defaults; and read a slotted label's style from the wrong shadow element and its opacity along the light-DOM parent rather than the slot it renders in.
```

### pitfalls.md:1665 (entry 66, Symptom)

Original:

```text
**Symptom:** After a clean install brought in a newer browser, the fidelity gate failed a text field's invalid states against the second reference by a fraction of a percent over its pixel budget, in both schemes, while every part comparison agreed.
```

Replacement:

```text
**Symptom:** After a clean install brought in a newer browser, the fidelity gate failed a text field's invalid states against the web-component reference by a fraction of a percent over its pixel budget, in both schemes, while every part comparison agreed.
```

### pitfalls.md:1695 (entry 70, heading)

Original:

```text
### 70. A primary-reference layout choice hard-coded where the second reference has no counterpart
```

Replacement:

```text
### 70. A primary-reference layout choice hard-coded where the web-component reference has no counterpart
```

### pitfalls.md:1697 (entry 70, Symptom)

Original:

```text
**Symptom:** The contact-sheet read found the Material extra-large and 2x-large buttons drawing their label at the top of a pill. Every gate was green.
```

Replacement:

```text
**Symptom:** The contact-sheet read found the second template's extra-large and 2x-large buttons drawing their label at the top of a pill. Every gate was green.
```

### pitfalls.md:1699 (entry 70, Cause)

Original:

```text
**Cause:** The primary reference keeps a tall button's label where the default height puts it, at the top, and the component carried that rule in code. The second reference has no tall button sizes, so no fidelity comparison covers those states, and the vendor choice sat in a generic component unseen.
```

Replacement:

```text
**Cause:** The primary reference keeps a tall button's label where the default height puts it, at the top, and the component carried that rule in code. The web-component reference has no tall button sizes, so no fidelity comparison covers those states, and the vendor choice sat in a generic component unseen.
```

### pitfalls.md:1729 (entry 74, Symptom)

Original:

```text
**Symptom:** Android screenshots showed the tooltip bubble drawing its label one character per line, though every measurement the gate checked on the cell itself was plausible. The Material dialog also ran off the screen, centered on its 640-wide showcase stage.
```

Replacement:

```text
**Symptom:** Android screenshots showed the tooltip bubble drawing its label one character per line, though every measurement the gate checked on the cell itself was plausible. The second template's dialog also ran off the screen, centered on its 640-wide showcase stage.
```

### pitfalls.md:1745 (entry 76, Symptom)

Original:

```text
**Symptom:** Material dialog actions measured 60px tall instead of 40, so the template answered an actions height of 100 instead of 80. The Modal action selector only came out right after the second reference page was decontaminated.
```

Replacement:

```text
**Symptom:** The web-component reference's dialog actions measured 60px tall instead of 40, so the template answered an actions height of 100 instead of 80. The Modal action selector only came out right after the web-component reference page was decontaminated.
```

### pitfalls.md:1747 (entry 76, Cause)

Original:

```text
**Cause:** The second reference rendered on the same page as the primary reference's stylesheet, whose global `*{box-sizing:inherit}` reset beat the Material web components' own `:host` rules inside their shadow trees.
```

Replacement:

```text
**Cause:** The web-component reference rendered on the same page as the primary reference's stylesheet, whose global `*{box-sizing:inherit}` reset beat the web components' own `:host` rules inside their shadow trees.
```

### pitfalls.md:1749 (entry 76, Fix/Lesson)

Original:

```text
**Fix/Lesson:** Each reference renders on a page that loads only its own styles. The second reference page loads no primary stylesheet. When a reference measures an implausible number, check what else on the page can reach it before writing that number into a template.
```

Replacement:

```text
**Fix/Lesson:** Each reference renders on a page that loads only its own styles. The web-component reference page loads no primary stylesheet. When a reference measures an implausible number, check what else on the page can reach it before writing that number into a template.
```

### pitfalls.md:1753 (entry 77, Symptom)

Original:

```text
**Symptom:** Menu shortcuts crowded their labels on every contact sheet. Later, the second-reference Menu measured 121 wide against 112 after its width comparison was restored.
```

Replacement:

```text
**Symptom:** Menu shortcuts crowded their labels on every contact sheet. Later, the web-component reference's Menu measured 121 wide against 112 after its width comparison was restored.
```

### pitfalls.md:1761 (entry 78, Symptom)

Original:

```text
**Symptom:** Native screenshots showed a Material switch's state-layer halo at rest, a check mark on an unselected small switch, and every tooltip caret at the bubble's left edge. Geometry gates passed on all three platforms.
```

Replacement:

```text
**Symptom:** Native screenshots showed the second template's switch drawing a state-layer halo at rest, a check mark on an unselected small switch, and every tooltip caret at the bubble's left edge. Geometry gates passed on all three platforms.
```

### pitfalls.md:1777 (entry 80, Symptom)

Original:

```text
**Symptom:** The TextArea dark-scheme comparison against the second reference failed at 2.01% against a 2% budget on one machine and 2.02% on the Linux CI image, after passing at 2.00% on another. Every dark state sat between 1.4% and 2.0%, while the light states stayed under 0.9%.
```

Replacement:

```text
**Symptom:** The TextArea dark-scheme comparison against the web-component reference failed at 2.01% against a 2% budget on one machine and 2.02% on the Linux CI image, after passing at 2.00% on another. Every dark state sat between 1.4% and 2.0%, while the light states stayed under 0.9%.
```

### pitfalls.md:1817 (entry 85, Symptom)

Original:

```text
**Symptom:** Under the second system, every small tag drew its label crossing the pill's outline. No gate failed.
```

Replacement:

```text
**Symptom:** Under the second template, every small tag drew its label crossing the pill's outline. No gate failed.
```

### pitfalls.md:1833 (entry 87, Symptom)

Original:

```text
**Symptom:** Every interactive tag measured 1.1 points wider than the second reference's chip on an 11-character label, and its container read transparent upstream although the chip was visibly filled.
```

Replacement:

```text
**Symptom:** Every interactive tag measured 1.1 points wider than the web-component reference's chip on an 11-character label, and its container read transparent upstream although the chip was visibly filled.
```
