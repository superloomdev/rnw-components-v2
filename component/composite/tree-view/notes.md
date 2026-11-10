# TreeView family

A hierarchical list of nodes that expand, collapse and select, walked by
the keyboard. TreeNode carries `requires_parent` (a node draws only inside
a TreeView) and `no_reference` (measured through the tree's samples).

## Decisions

Nodes come as `nodes` data (samples cannot carry element children, as
TileGroup's `items`, D21a); TreeNode is the row the context renders. The
depth indent is upstream's `calcOffset` verbatim in `control.tree_indent`
units.

## Platform

`platform.support` is `both`.
