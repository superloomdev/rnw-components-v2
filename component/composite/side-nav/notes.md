# Navigation

The UI shell's side navigation. `SideNav` is a `navigation` landmark in
flow beside the page, on `color.side_nav_container`. It draws its `items`
in one `SideNavItems` list: links through `SideNavLink`, menus through
`SideNavMenu` (links through `SideNavMenuItem`) and rules through
`SideNavDivider`, then its children (`HeaderSideNavItems`,
`SideNavHeader`, `SideNavDetails`, `SideNavFooter`). `SideNavItem` is one
item of the list, `SideNavIcon` an icon before a link's or a menu's text,
`SideNavLinkText` a link's text.

U6 (upstream quoted; probes `recipes/probe/SideNav*.cells.txt`, at 1280
and `@375`). The numbers are the probe's: the navigation 256 wide (a rail
48), the list 16 under its top, the links at least 32 tall (48 large), 16
in from each side, a menu's links 32 tall from 32 in (72 after its icon),
the current bar 3 wide, the icons 16 with 24 after them, the divider 1 tall,
8 above and below, 16 in.

## The window rules and the outcomes

Each rule below has more than one outcome; the sample state that draws
each is named.

- The drawn width follows the window and the props
  (`ui-shell/side-nav/_side-nav.scss:30-117`, in the cascade's order):
  open is 256 (`:73-75`); closed, a fixed navigation is moved out by its
  own width (`:114-117`), one that is not persistent is 0 (`:69-71`), a
  rail is 48 (`:65-67`), and a persistent one is 256 from `breakpoint.lg`,
  read from the window, and 0 below it (`:48-55`). Drawn: `SideNav /
  default` (256 in the primary window, nothing in the narrow set),
  `expanded` (256 in both), `rail` (48 in both), `railExpanded` (256),
  `hidden` (nothing in both), `fixed` (nothing in both),
  `fixedExpanded` (256 in both).
- Open below lg and not fixed, the overlay covers the window under the
  navigation (`:77-101`): `SideNav / expanded` and `railExpanded` in the
  narrow set draw it; `fixedExpanded` in the narrow set and every primary
  state do not.
- A link is current or not: `SideNavLink / default`, `current`,
  `icon`, `iconCurrent`; `SideNavMenuItem / default`, `current`. A
  current link in a menu keeps its fill under the pointer, one outside a
  menu takes the hover fill (`:157-173`): the `hover` interaction of
  `SideNavMenuItem / current` and `SideNavLink / current`.
- A link has an icon or not: `SideNavLink / icon`, `iconCurrent`;
  `default`, `current`.
- A link is the large height on its own, inside a large item, or neither
  (`:360-362`): `SideNavLink / large`, `inLargeItem`, `default`.
- A menu is closed or open, and active (`isActive`, or closed holding the
  current link, `SideNavMenu.tsx` `hasActiveDescendant`) or not:
  `SideNavMenu / default` (closed), `open`, `active` (closed holding the
  current link: the selected fill and the bar), `openIcon` (open holding
  it: not active, the current link drawn instead).
- A menu has an icon or not, and its links start 72 or 32 in
  (`:314-324`): `SideNavMenu / openIcon`, `open`.
- A menu is the large height or not (`:259-261`): `SideNavMenu / large`,
  `default`.
- A link's text fits or is truncated at its end (`:364-375`):
  `SideNavLinkText / default`, `long`; it is in a menu (weight 400) or not:
  `inMenu`, `default`.
- An icon sits in a row (a link, a menu's button: as wide as its glyph) or
  alone in an item (its box spans the item and centers the glyph, as
  upstream's flex box does outside a flex row): `SideNavLink / icon`,
  `SideNavMenu / active`; `SideNavIcon / default`.

## Decisions

- **The navigation lays out in flow and takes the room it draws.**
  Upstream fixes it under its fixed header (`:30-55`) and offsets `Content`
  beside it (`content/_content.scss:27-33`: 48 beside any side navigation,
  256 beside an expanded one). A native screen has no fixed layer: a host
  places the navigation beside its page in a row, as the Header family lays
  the bar out in flow. Its references stage the body and start upstream's
  navigation at the body's top.
- **The overlay starts at the navigation's top.** Upstream's starts 48
  under the window's top, under its fixed header (`:82`); ours covers the
  window from the navigation down, so the reference compares its fill and
  its inline geometry.
- **The navigation and the menus take data, the members are also
  components.** As the header's navigation, `SideNav` and `SideNavItems`
  draw links, menus and dividers from `items`, and `SideNavMenu` its links
  from `items`; each member is its own component for a host that composes
  them by hand.
- **The list does not scroll by itself.** Upstream's list scrolls inside
  its fixed navigation (`:130-144`); ours is in flow, and the host's
  scroller holds it.
- **A link takes focus only while the navigation is open or a rail**, as
  upstream's `tabIndex` does (`SideNavLink.tsx`, `SideNavMenu.tsx`).
- **A current link sets `aria-current="page"`.** Upstream marks it with a
  class only; the attribute names the page to assistive technology.
- **SideNavItems**, **SideNavItem**, **SideNavLink**, **SideNavLinkText**,
  **SideNavIcon**, **SideNavMenu**, **SideNavMenuItem**, **SideNavDivider**
  (`requires_parent`): must be composed inside SideNav (SideNavLinkText in
  a SideNavLink or a SideNavMenuItem, SideNavMenuItem in a SideNavMenu);
  their samples mount in it (`wrappers`).
- **SideNavHeader**, **SideNavDetails**, **SideNavFooter** (`requires_parent`,
  `no_reference`): must be composed inside SideNav. The pinned stylesheet
  has no rule for `.cds--side-nav__header`, `__details`, `__title`,
  `__footer` or `__toggle` (`css/styles.min.css`; probes
  `recipes/probe/SideNavHeader.cells.txt`, `SideNavDetails`,
  `SideNavFooter`): upstream draws them in the browser's defaults (a 32
  heading, a 16 text, a 13.33 button face), which is no design to measure.
  They are drawn from the family's own cells: the header a large row
  holding its icon and the menu title's type; the details the list's
  space, a level-2 heading in the menu title's type and a text in the menu
  link's; the footer a large toggle row with its glyph, labelled by its
  assistive text, with the link's hover fill and focus ring.
- **SideNavItem's text** takes `type.body_compact_01` and the navigation's
  text: upstream's item has no text rule and its text draws in the page's
  default type, so the reference compares the item's box but its height.
- **SideNavIcon `small`** is accepted and changes nothing: the pinned
  stylesheet has no rule for upstream's small class.

## Platform

`both` for every row. The overlay is an absolute layer of the navigation
sized to the window; the host keeps the navigation above the page it
covers. A rail opens under a pointer only where the platform has one.
