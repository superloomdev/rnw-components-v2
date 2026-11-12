# TreeView family

A hierarchical list of nodes that expand, collapse and select, walked by
the keyboard. TreeNode carries `requires_parent` (a node draws only inside
a TreeView) and `no_reference` (measured through the tree's samples).

## Decisions

Nodes come as `nodes` data (samples cannot carry element children, as
TileGroup's `items`, D21a); TreeNode is the row the context renders. The
depth indent is upstream's `calcOffset` verbatim in `control.tree_indent`
units.

Only the focused node is a tab stop: each node takes `tabIndex` -1 and the
focused one 0 (upstream `TreeNode.js:281`, `TreeView.js:112`), passed
explicitly because a react-native-web `Pressable` otherwise gives every
enabled node 0.

## U2 repair (upstream quoted)

Probe `TreeView.json`: the tree paints nothing and each row paints the
container cell; the label carries the hover and selected fills, the ring
and the ink (`labels` cells). Upstream nests a child row in its parent's 16
padding (depth-1 rows x 52, width 304) and the label cancels the sum to span
the tree (label x 0, width 320, margin-left -40 / -16 / -56, padding-left the
same, padding-right 16); our flat rows step in by `depth * indent` and the
label reaches back over that and the row's start padding. The active bar is
an overlay at the tree's edge, as upstream's `::before` (row border 0). The
toggle box pulls back by `control.tree_toggle_offset` and keeps it after
(toggle x 48, margin -4 / 4) and draws the 16 caret. The label sits
`spacing_03` above the tree (`form/_form.scss` `cds--label` margin-block-end).
Rows take `minHeight`, so scaled text grows them. The reference passes each
row's `id`, as the probe mount does: upstream selection keys on it.

## Platform

`platform.support` is `both`.
