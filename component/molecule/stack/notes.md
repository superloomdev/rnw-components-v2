## Decisions

- **The step scale.** `gap` is a step of the theme's spacing scale (`spacing.spacing_01` .. `spacing.spacing_13`), never a free length: a value outside the steps draws no gap, matching the upstream scale classes that emit a gap only for a step. A string length is not carried.
- **Orientation.** The default is a column; `horizontal` is a row that shrinks to its content (`alignSelf: 'flex-start'`), the same answer the upstream inline grid gives. `HStack` and `VStack` are the one component with the orientation decided, so a registry composition keeps the answers identical.

## Platform

A flex direction and a gap answer the grid on every platform; no element semantics are carried.
