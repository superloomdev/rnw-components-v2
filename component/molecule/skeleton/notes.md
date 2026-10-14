# Skeleton

SkeletonIcon and IconSkeleton draw the skeleton placeholder at the smallest icon size; SkeletonText draws lines of the theme's text or heading height whose widths step back by a fixed sequence.

## Decisions (roster flag `superloom_decision`)

- **No second-system skeleton.** The second system has no skeleton - the roster's `superloom_decision`. That system's template draws the skeleton family as `surface_container_highest` with an `on_surface` 8% shimmer and a radius of 4; the default's shimmer is one ramp step past its container.
- **The sweep is the primary's.** The shimmer's keyframes are the primary reference's skeleton animation, verbatim stops; the paragraph's stepped line widths are its fixed sequence applied per line. Reduced motion shows the shimmer at rest at full cover, as the primary does.

## Platform

Both platforms. On a native platform the shimmer draws at rest, as the indeterminate progress bar draws its bar, because the keyframes are a web style; the percent-width paragraph resolves against the root's layout on both.
