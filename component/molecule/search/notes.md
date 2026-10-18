# Search

A `search` landmark holding the field frame, a decorative leading
magnifier and a clear action. The field draws no visible label - the
primary's own search label is visually hidden - so `label` and
`accessibilityLabel` name the input directly (default `Search`), and no
`aria-labelledby` is emitted. Escape is the field's own contract: it
clears a populated field, or asks an expandable owner to collapse an
empty one.

## Semantics

The input carries the `searchbox` role; the root is the `search`
landmark. The clear mounts hidden and untabbable while the field is
empty, and one action slot is reserved on each side of the text whether
or not it shows. The collapsed expandable trigger expands on press,
Enter or Space - never on focus alone - and focus moves to the input on
open and back to the trigger after an Escape collapse.

## ExpandableSearch

`ExpandableSearch` opens the field from the icon action; the second
system has no expandable search element, so its values are a Superloom
decision - the roster's `superloom_decision` flag. Its disabled icon
reads the indicator's disabled leaf, as the expandable member does, not
the plain search's on-color-disabled.

## SearchSkeleton

`SearchSkeleton` draws the search field's placeholder box at the field's
size with no label placeholder; the second system has no skeleton, so
its values are a Superloom decision - the roster's `superloom_decision`
flag.

## Uncarried variants

`xs` size (the field scale keeps `sm`/`md`/`lg`), `small` (deprecated
alias), `light` (deprecated upstream; `surface` is this library's
answer), `renderIcon` (the magnifier is the theme's `search` glyph; a
custom icon is not a Search), `role` (deprecated upstream; the input's
`searchbox` role is fixed), `closeButtonLabelText` (the clear's name is
the contract's `Clear search input`), `expandable`'s `isExpanded`
naming (ours is `expanded`), `onExpand`'s callback signature.
