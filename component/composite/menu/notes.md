# Menu

A `role="menu"` surface of `role="menuitem"` entries (`menuitemcheckbox`
for selectable items) and `role="separator"` dividers, opened at `x`,`y`
and fitted to the viewport by the `menu-position` behavior. The caller owns
`open` and closes through `onClose` (Escape, Tab, outside press, or after
an item is chosen).

## Decisions

- **The `list` family draws the list.** Container fill, corner, elevation
  and the per-state item fills and label colors are the `list` cells; the
  menu's own member cells give the item height, the container's block
  padding, the divider, the icon size and the danger item's cells.
- **Item order is fixed: mark seat, icon seat, label, shortcut.** Both
  references lead with the selection and icon seats, so no anatomy decides
  their side. The mark's room is reserved only where
  `anatomy.list_selected_mark` says `shown`; the mark icon itself draws
  only on a selected item.
- **Dividers are data, not borders.** A `{ divider: true }` entry renders
  `role="separator"` from `control.menu_divider_width` and
  `color.list_item_divider`; the option block's inner divider is off
  (the `dividerWidth` option is 0).
- **Danger items read the member cells:** the `menu_item_danger_*` fill and
  labels replace the list's state cells for that item.
- **Selection.** The surface itself takes focus when it opens (matching the
  reference `ul`'s `tabIndex=-1`); arrows rove enabled items (disabled are
  skipped), Home and End the ends; the rove is focus, not activation -
  Enter or a click chooses. The dismiss behavior binds Escape and outside
  press at document level while open.
- **Position.** `useMenuPosition` measures the surface and fits it inside
  the viewport margin (a decision constant of 8); `menuAlignment` `top`
  grows it up from `y`. No minimum width cell exists, so the surface sizes
  to its widest item - the contract's width range is queued for a request.
- **The surface renders through an overlay host where one is mounted**, else
  in place, `fixed` on the web and `absolute` natively.

## Cells

- `color.list_container`, `shadow.list`, `stacking.dropdown` - the surface
- `control.menu_padding_block`, `control.menu_item_height`, `control.list_item_padding_inline` - geometry
- `color.list_item_container_*` (hover, active, selected, selected hover), `color.list_item_label*` (rest, hover, selected, disabled), `type.list_item` - the items
- `color.list_item_divider`, `control.menu_divider_width` - separators
- `color.menu_item_danger_*` - the danger item
- `control.menu_icon_size`, `size.icon_01` - the icon and the mark
- `anatomy.list_selected_mark` - whether the mark's room exists

## Accessibility

- `role="menu"` with `aria-label`; `role="menuitem"` / `menuitemcheckbox`
  with `aria-checked` on selectable items; `role="separator"` on dividers;
  disabled items are out of the focus order.

## Second reference

`md-menu` of `md-menu-item` elements (`md-divider` for separators). It has
no danger kind, no selected marks and leading icons in `start` slots.
