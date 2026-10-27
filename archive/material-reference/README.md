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
