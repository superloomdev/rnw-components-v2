- **ContainedListItem** (requires_parent): must be composed inside ContainedList; measured through ContainedList's samples.
- **ContainedListItem** (no_reference): no standalone upstream mount; measured through ContainedList's samples.
- **ContainedList** (superloom_decision): a ContainedList draws no outer margin - adjacent on-page lists' `control.contained_list_gap` is the host's spacing.
- **ContainedListItem**: an `action: 'tag'` draws at least the layout's small size (`size.size_small`) in every list size - upstream's action LayoutConstraint (`ContainedListItem.js:39-45`, min `sm`) floors it.
- **ContainedList** (superloom_decision): upstream's header is sticky inside a scroll container; a host scroll view pins it (`stickyHeaderIndices`), the list itself does not.
- **Geometry against upstream** (read once the reference compared every
  box; outcomes and their states: a plain row `default`, an icon row
  `icons`, an action row `actions`, inset rulers `inset`, the search
  `search`, the last row in each). Upstream pads a row's content by half
  the row less one line (`_contained-list.scss:197-200`), so the label sits
  in the row's middle; ours drew it at the row's top. The ruler is the
  item's own last line (`::before`, `inset-block-end: 0`, `:203-222`) and
  every item after the first starts on it (`margin-block-start: -1px`,
  `:189-191`): a 47 pitch, where ours stacked a 48 row and a 1 ruler.
  Inset rulers leave the padding at both ends. The header pads both ends
  (`:62-70`), so the label is 368 wide in a 400 list. A search is the
  header's action layer (`ContainedList.js`, `.cds--contained-list__action`
  absolute at the top, `:258-266`): it stands over the label, not under the
  header. The icon's column spans the line, as the grid cell stretches it.
  The tag action named its text as `label`, which Tag does not read: it
  drew an empty tag.
