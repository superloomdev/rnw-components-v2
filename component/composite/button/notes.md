# ComboButton

A primary action Button joined to a primary IconButton that opens a Menu of further actions: the action takes `label` and `onPress`, the trigger opens the menu over the container and its chevron turns while open.

## Decisions (roster flag `superloom_decision`)

- **The seam is the border width.** `columnGap: border.width_01` separates the two seats, matching the primary's `column-gap: 1px`: whatever shows between them is the surface behind, so a template answers the same seam.
- **The action's window is the combo's less the seam and the trigger.** The primary styles the action's wrapper `min-width: 160px - 1px - trigger` per size and caps the button at `240px - 1px`; the component computes the same from `control.combo_button_min_width`, `control.combo_button_max_width` and the trigger's side for the size (`size.size_*` for sm/md, `control.icon_button_size` for lg). `xs` draws the `sm` trigger - the icon button has no extra-small size.
- **The trigger announces its menu.** It is the icon button at kind `primary`, labeled "Additional actions", with `aria-haspopup`, `aria-expanded` while open and `aria-controls` naming the menu's id.
- **The chevron turns while open.** `iconRotation` is 180 while the menu is open, transitioning over `motion.duration_fast_02` with `motion.easing_standard_productive` on the web; a native platform turns without a transition, as the icon button documents.
- **Menu placement is edge to edge.** The container is measured through `useAnchoredPosition` and the range handed to `Menu` is its two edges: `bottom` opens the surface at the container's bottom edge, `top` ends it at the top edge, `-start` aligns the surface's start with the container's and `-end` its end. For the plain `top`/`bottom` alignments the surface's `width` is the measured container's, as the primary's menu spans the combo; the `-start`/`-end` alignments take the menu's natural width. The behavior gained the `preferEnd` ordering (`behaviors/menu.js`) so a `-end` or `top` alignment picks the edge-to-edge candidate before the fallback.
- **The open menu's surface is not a measured part.** The upstream Menu portals to `document.body` and the upstream ComboButton forwards no `target`, so no cell-scoped selector ever reaches it; the surface is covered by the Menu row, and the combo's own menu width and placement by its unit tests.
- **The action's label holds its start padding.** The primary draws `.cds--btn` content `space-between`, so under the action's width window the label stays at its start padding; the theme's `anatomy.button_label` answers that placement (`top`), so the action passes no alignment prop.
- **The trigger's press draws no focus ring.** The primary's `handleTriggerMousedown` prevents the mousedown's default, so a pointer press never focuses the trigger; the component forwards the same handler through the IconButton's `onMouseDown`, leaving keyboard focus alone.
- **No `open` interaction is driven in the gates.** The open menu cannot be compared against the primary's, which portals to `document.body` and never appears in the cell shot; the open menu's width and placement and the chevron's 180-degree turn are covered by the unit tests and the fire rows `combo-button-menu-width` and `combo-button-chevron-turn`.
- **No second system.** The second system ships no split button; the combo's own metrics are a Superloom decision - the roster's `superloom_decision` flag.

## Platform

Both. The seats, the seam and the open menu render on iOS, Android and web; the container measurement reads the same layout values natively, and the trigger's turn has no transition there.
