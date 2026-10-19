## Decisions

- **Level context.** `useSectionLevel`, `useHeadingLevel` and the `HeadingLevelProvider` are shared per-system behaviors: a Section publishes the enclosing level plus one (or its `level` override), clamped at six, and a Heading reads it. A Section's `level` sets the subtree's level outright - `level: 3` headings three - not a skip count.
- **Type set.** A level N heading draws `type.heading0<7 - N>`: heading-06 at level 1 down to heading-01 at level 6, and `color.text_primary`. The type name is the theme's flat family; where the theme aliases two of the family's sets to the same values, the two levels look alike, same as the reference's own sets.
- **Semantics.** `accessibilityRole: 'header'` plus the level ride the registry Text; the host turns them into the heading element of that level, so a screen reader announcement and the document outline see real headings on every level.
- **Deep reads.** A hosted overlay keeps the heading context it opened from (the overlay bridge republishes it), so a Heading inside a Modal keeps its section depth.

## Platform

Section is a plain container on every platform; the heading element is the web host's answer to the header role and the level.
