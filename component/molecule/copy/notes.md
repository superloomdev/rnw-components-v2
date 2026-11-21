# Copy

CopyButton is an icon button whose tooltip confirms a copy for a moment
after it is pressed.

## Decisions

- No clipboard access inside the component: `onClick` is the host's write.
- The upstream `__feedback` bubble element is never emitted (the census
  marks it not built); the tooltip carries the feedback text instead.
- The fill is the layer, as upstream draws it with no `kind`. The pinned
  upstream release draws those colors under `:where()` (`_copy-button.scss:24`),
  so a bare upstream CopyButton takes ButtonBase's `kind = "primary"`
  (`Button/ButtonBase.js:23`) and paints blue; its Default story passes
  `kind: ''` (`CopyButton.stories.js:19`) and `v11.121.0` passes
  `kind ?? null`. The reference mount passes `kind: ''`.

## Platform

`platform.support` is `both`: the IconButton and Tooltip composition runs
on web and native unchanged.
