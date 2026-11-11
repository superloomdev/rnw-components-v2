# PageHeader family

The page's header stack: breadcrumb row, title row (icon + heading +
actions), subtitle, tags; `scrollY`/`collapseHeader` drive the collapsed
bar. Upstream is the product-patterns `PageHeader`.

## Decisions

Composes `Breadcrumb`, `Button`, `Icon`, `Tag`; `scrollY` is a prop (no
DOM scroll read); the collapsed bar keeps the title row only.

## Platform

`platform.support` is `both`.
