# Accordion

Accordion stacks headed sections that open and close independently, each
with a chevron and a divider rule. Its members are AccordionItem (one
headed section, composited inside Accordion) and AccordionSkeleton (the
placeholder shape while the content loads).

## Decisions

- `requires_parent` on AccordionItem: the member reads the parent's align,
  size, flush and divider-hover context; standalone it draws one item with
  its own top rule.
- `no_reference` on AccordionItem: there is no upstream visual reference
  for the member alone; it is measured through Accordion's `default`,
  `open`, `start` and `disabled` samples.
- `control.accordion_content_end_ratio` stands in for the primary
  reference's 480/640 content end-padding steps (the compact variant is 0).
- The hover rule blends: a hovered heading's own top rule and the next
  item's rule both read `color.accordion_divider_hover`.
- AccordionSkeleton's `ordered` has no upstream propTypes entry (recorded
  in the census); the flag is still offered.

## Platform

`platform.support` is `both`: the same factory runs on web and native. The
content region mounts and unmounts with `open` (no shared motion seam is
composed here); the chevron swaps `chevron_down`/`chevron_up` over
`motion.duration_fast_02` where the host animates.
