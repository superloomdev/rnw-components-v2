# Copy

CopyButton is an icon button whose tooltip confirms a copy for a moment
after it is pressed.

## Decisions

- No clipboard access inside the component: `onClick` is the host's write.
- The upstream `__feedback` bubble element is never emitted (the census
  marks it not built); the tooltip carries the feedback text instead.

## Platform

`platform.support` is `both`: the IconButton and Tooltip composition runs
on web and native unchanged.
