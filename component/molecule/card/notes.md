# Card family

A productive card with a header, a body and actions in its header or
footer. The product-patterns `ProductiveCard` is the upstream.

## Decisions

Action icons are ghost `IconButton`s (sm at the top, md at the bottom),
not raw `__icon` seats; the overflow is an `OverflowMenu`. The footer
renders only when there are bottom actions or a button. `clickZone:
'one'` puts the role, the tab stop and key handling on the root.

## Platform

`platform.support` is `both`.
