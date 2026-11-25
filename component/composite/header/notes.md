# Header

The UI shell's bar and its members. `Header` is a `banner` landmark, a row
`control.header_height` tall on `color.header_container` with a
`border.width_01` rule in `color.header_border` under it. From its data it
draws `HeaderMenuButton`, `HeaderName`, `HeaderNavigation` (links through
`HeaderMenuItem`, menus through `HeaderMenu`), `HeaderGlobalBar` (actions
through `HeaderGlobalAction`) and `HeaderPanel`, then its children.
`HeaderContainer` holds the side navigation's open state for a header.
`HeaderSideNavItems` lists the header's links again for the side
navigation of a narrow window. `Content` is the page's `main` landmark.

U5 (upstream quoted; probes `recipes/probe/Header*.cells.txt` and
`Content.cells.txt`, at 1280 and `@375`). The bar's numbers are the
probe's: the bar 48 with its 1 rule, the links 47 tall (the bar less its
rule), the name 16 / 32 (16 / 16 below md, 8 at its start after a collapsible
toggle), the actions 48 square with a 20 glyph, the menu 200 wide with 48
rows, the panel 256 wide from the bar's bottom.

## The window rules and the outcomes

Each rule below has more than one outcome; the sample state that draws
each is named.

- The menu bar is drawn from `breakpoint.lg`, read from the window
  (`ui-shell/header/_header.scss:205-213`). Drawn: `Header / shell` and
  every HeaderNavigation, HeaderMenuItem and HeaderMenu state in the
  primary window; not drawn: `Header / shell` in the narrow set.
- A menu button without `isCollapsible` is drawn below `breakpoint.lg`
  only (`:149-153`); a collapsible one at every width. Drawn:
  `HeaderMenuButton / default` and `Header / menuButton` in the narrow
  set, `HeaderMenuButton / collapsible`, `active` and `Header /
  collapsible` in both; not drawn: `HeaderMenuButton / default` and
  `Header / menuButton` in the primary window.
- The name starts 8 in after a collapsible toggle, 16 otherwise
  (`:197-200`): the rule skips a toggle with the `__hidden` class, which
  a toggle without `isCollapsible` carries at every width
  (`HeaderMenuButton.js:34`), so a shown one below lg does not move the
  name (fidelity `Header / narrow` `menuButton`: name 133.25 wide
  upstream). After: `Header / collapsible` (both sets); without:
  `Header / shell`, `Header / menuButton` (both sets), every HeaderName
  state.
- The name's end padding is 32, 16 below `breakpoint.md` (`:163,173-175`):
  every HeaderName and Header state with a name, in each set.
- A menu is closed or open; a closed menu holding the current link draws
  its title current (`HeaderMenu.tsx` `hasActiveDescendant`), an open one
  draws the row current instead: `HeaderMenu / default`, `current`,
  `open`, `openCurrent`.
- A link is current or not: `HeaderMenuItem / default`, `current`;
  `Header / shell` holds both.
- An action and the menu button are active or not: `HeaderGlobalAction /
  default`, `active`; `HeaderMenuButton / collapsible`, `active`;
  `HeaderContainer / default`, `expanded`.
- The panel is expanded or collapsed: `HeaderPanel / expanded`,
  `collapsed`.
- HeaderSideNavItems is drawn below `breakpoint.lg` only
  (`ui-shell/side-nav/_side-nav.scss:466-476`), with or without its rule
  (`:478-486`): `HeaderSideNavItems / default`, `divider` draw both below
  lg, inside the expanded side navigation they mount in; from lg the list
  draws nothing and the navigation draws alone (fidelity primary and
  narrow sets). Inside the side navigation its links are at least
  `control.header_side_nav_item_min_height` tall (32, `:339-358`; the
  form classes give the target floor, plan E14).
- The action's below-md minimum width (`_header.scss:58-60`,
  `$spacing-09`) is the action's own 48: no outcome moves.

## Decisions

- **The bar lays out in flow.** Upstream fixes the header to the window's
  top and offsets `Content` under it (`content/_content.scss:22-25`) and
  beside a side navigation (`:27-33`). A native screen has no fixed
  layer: a host places the header above its scrolling content, so the bar
  is in flow and `Content` takes no offset. Its references stage the body,
  so upstream's fixed bar draws in the same place.
- **The header takes data, the members are also components.** As the
  breadcrumb's trail, the header draws its members from `menuButton`,
  `name`, `navigation`, `actions` and `panel`; each member is its own
  component for a host that composes them by hand.
- **The open menu hangs from its title in the bar's own stacking**
  (`_header.scss:369-381`), stacked at `stacking.header`.
- **The current link's label stays `color.header_menu_item_label`.** The
  current class upstream (0,1,0) loses to `a.cds--header__menu-item`
  (0,1,1), so the current link keeps the secondary text and the bar alone
  marks it (the probe reads the secondary text there).
- **HeaderMenuButton**, **HeaderName**, **HeaderNavigation**,
  **HeaderMenu**, **HeaderMenuItem**, **HeaderGlobalBar**,
  **HeaderGlobalAction**, **HeaderPanel** (`requires_parent`): must be
  composed inside Header; their samples mount in it (`wrappers`).
- **HeaderSideNavItems** (`requires_parent`): must be composed inside a
  SideNav, the side navigation of a header; its samples mount in an
  expanded one (`wrappers`), staged at the body's top as the reference
  stages upstream's fixed one. Upstream draws the list below lg only, so
  its reference is compared in its narrow window; in the wide window both
  sides draw the navigation without it (plan 0162 E17 (9): U6 had
  withdrawn the reference, U7r restored it from `073650a`).

## Platform

`both` for every row. The panel is a layer: it mounts through an overlay
host where one is mounted and covers the viewport otherwise, as the
dialog does. The open header menu hangs under the bar outside the bar's
box; a native host keeps the bar above the content it scrolls.
