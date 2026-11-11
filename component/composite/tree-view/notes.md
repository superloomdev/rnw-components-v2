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

## Platform

`platform.support` is `both`.
