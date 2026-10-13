# Skeleton

SkeletonPlaceholder draws a box in the theme's skeleton container color with a shimmer sweeping across it in the skeleton shimmer color, sized by its props or the placeholder size.

## Decisions (roster flag `superloom_decision`)

- **No second-system skeleton.** The second system has no skeleton - the roster's `superloom_decision`. That system's template draws the skeleton family as `surface_container_highest` with an `on_surface` 8% shimmer and a radius of 4; the default's shimmer is one ramp step past its container. Where the second system is silent the template decides.
- **The sweep is the primary's.** The shimmer's keyframes are the primary reference's skeleton animation, verbatim stops. Reduced motion shows the shimmer at rest at full cover, the state a static capture of the running sweep shows.

## Platform

Both platforms. On a native platform the shimmer draws at rest, as the indeterminate progress bar draws its bar, because the keyframes are a web style.
