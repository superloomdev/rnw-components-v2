# Pagination family

The pagination bar and its satellite rows.

## Decisions

The rows carry no roster flags. PaginationSkeleton composes SkeletonText
bars; the widths are the contract's skeleton cells, not the upstream
placeholders' literal widths.

## Platform

`platform.support` is `both`: the rows render on the web and natively from
the same source.
