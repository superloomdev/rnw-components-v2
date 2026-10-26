# Popover

## Decisions

`requires_parent`: PopoverContent must be composed inside Popover; the reference draws the content only inside an open parent.

`no_reference`: the reference draws this member only inside an open parent, so it is measured through that parent's samples.


- `open` is caller-owned, as upstream's; the component asks the caller to close through `onRequestClose` on Escape and outside press.
- The caret lifts the surface half its height off the anchor (`offset + caretHeight / 2`), the reference's own `calc`.
- The inverse (`highContrast`) surface reads the `tooltip_*` cells and draws neither shadow nor border, as the reference's high-contrast popover does.

## Platform

Both platforms draw the same box; the layer mounts `fixed` on the web and `absolute` inside the overlay host on a native platform.

PopoverContent is measured through Popover's samples; the reference draws it only inside an open Popover.
