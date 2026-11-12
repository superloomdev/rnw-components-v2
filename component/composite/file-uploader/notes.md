# FileUploader, FileUploaderButton, FileUploaderDropContainer, FileUploaderItem, Filename, FileUploaderSkeleton

- **Picking.** The button, the drop area and the uploader pick through the
  host's `adapters.FilePicker`, a function (`FilePicker({ accept, multiple })`
  returning a promise of `{ name, size, type }` entries). Without it a document's hidden
  file input stands in (`behaviors/dom.js` `pickFiles`); a host with neither
  (a native host without the adapter) draws the picking rows disabled and
  reports `adapter_missing`. Dropping files is web only: the drop area
  listens on its own node for drag events, which a native host never sends.
- **Validation.** A drop area marks an entry `invalidFileType` when it is
  larger than `maxFileSize` or both its type and its extension (found by
  `pattern`) are outside a non-empty `accept`; the uploader checks only
  `maxFileSize` (its chooser filters by `accept`), reports every entry
  through `onAddFiles` and lists the valid ones.
- **Filename** is the status seat both upstream parents wrap it in (the
  state container): every upstream rule for its parts is scoped there, so a
  bare upstream Filename draws the browser's own button. Its reference mount
  wraps it the same way.
- **Standalone members.** FileUploaderButton, FileUploaderDropContainer and
  FileUploaderItem render on their own as upstream does (the drag-and-drop
  pattern composes the drop area and items without an uploader), so none
  requires a parent.
- **Not drawn.** A name cut by the item's width shows no tooltip (upstream
  wraps a cut name in one); the uploader's list keeps no files across a
  remount, as upstream's internal list; `warn` has no upstream look here.
