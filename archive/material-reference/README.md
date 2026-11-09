# Material reference archive

From 2026-10-02 to 2026-10-27 every component in this library was measured against two references: Carbon
(`@carbon/react`, the primary) and Material (`@material/web`, the "second" reference). The second reference existed to
prove that the components are generic: one component, two very different design systems, both reproduced from theme
data alone.

That proof was made, and on 2026-10-27 the owner retired Material as a measured reference (plan 0160, decision D41).
The library ships two templates, `carbon` and `default`. The `material` template package is frozen on the registry at
1.0.0 and is not regenerated.

Status: incomplete. 32 of 62 rows with a Material twin were measured. The remaining rows, never measured:
Icon, Tab, TabList, IconTab, Switch, IconSwitch, MenuButton, MenuItem, MenuItemDivider, MenuItemGroup,
MenuItemRadioGroup, MenuItemSelectable, OverflowMenu, OverflowMenuItem, ComposedModal, ModalHeader, ModalBody,
ModalFooter, Card, RadioTile, DatePicker, DatePickerInput, DatePickerSkeleton, SideNav, SideNavDetails, SideNavDivider,
SideNavFooter, SideNavHeader, SideNavIcon, SideNavItem, SideNavItems, SideNavLink, SideNavLinkText, SideNavMenu,
SideNavMenuItem.

What is here:
- `rows/` - each component's `second` reference block, verbatim.
- `harness/` - the harness code that mounted, measured and shot the second reference.
- `fixtures/` - the gate fixture entries that belonged to the second reference.
- `census/` - the Material columns of the milestone census sheets.
- `LESSONS.md` - what Material taught, per family, and the contract value each lesson became.

Nothing here is imported, linted, scanned or shipped.

How to resume: restore `rows/<Row>.second.js` into the row's `reference*.js` as its `second` key; restore the harness
parts into `_test/harness/` and the specs; add back `@material/web`, `@fontsource/roboto` and the material template
package to `_test/package.json`; restore the fixture entries; regenerate the material template against the published
default template; then run the full browser gates.

## Why this folder exists and what moved here (2026-10-28)

Material was used only as an exercise: a deliberately very different design system, rendered from theme data alone, to
force the components, contract and engine to become generic (behavior-named enums, role grid, state layers). It was
done halfway - the rows listed above were never measured - was a large time cost, and Material is no longer a priority
design system. The lessons it produced live on as enum values in the contract (see `LESSONS.md`).

On 2026-10-28 every Material reference was removed from the Superloom framework repository (`codebase-superloom`). The
removed passages are in `superloom-docs/REMOVED.md` with source line and commit (`43abd48`), so they can be restored
exactly.

The full source of the `js-client-helper-themer-template-material` package was moved here (`template-package/`) from
`codebase-js-helper-modules` at commit `9332787`, and deleted there. The registry copy
`@superloomdev/js-client-helper-themer-template-material@1.0.0` remains frozen and is never regenerated.

Material still mentioned elsewhere, intentionally left for the component-library plan to clean at its next template
regeneration:
- `codebase-js-helper-modules`: `docs/template.md` in `js-client-helper-themer` names Material in two doc passages;
  `scripts/grid-recipe.js` in `js-client-helper-themer-template-default` has one comment. The `anatomy.surface_material`
  contract token (solid/glass) shares only the English word and stays.
- `codebase-rnw-components-v2` (outside `archive/`): 19 tracked files mention material, mainly `material_twin` rows in
  `data/roster.json` and `data/roster.candidate.json`, the Material columns in `data/icons.json`, plus scripts, tests
  and docs.
- `codebase-demo-client-rnw-v2`: `AGENTS.md`, `src/screens/showcase/FamilyPage.js`,
  `src/screens/showcase/planned-rows.js`.
- `codebase-superloom`: nothing type-(i) remains; only the English word ("reference material", "first-read material",
  "materializes") and generic second-consumer phrasing.

This folder is not imported, linted, scanned or shipped; it is safe to keep or to delete. To restore, follow "How to
resume" above plus: restore the `codebase-superloom` passages from `superloom-docs/REMOVED.md`, and move
`template-package/` back to `codebase-js-helper-modules` at `src/helper-modules-client/` and add it to that
repository's CI publish list (the module was not in the list when archived).
