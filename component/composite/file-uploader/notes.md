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
- **Ligatures.** The description and the error body each hold two `fi`
  pairs ("file", "files"); the reference's reset keeps common ligatures on
  under tracking (`_reset.scss:102`), so its lines were one tracking step
  narrower per pair (description 264.16 vs 263.64, error body 260.44 vs
  259.63). The type style turns the ligature feature on for every web run;
  `font-variant-ligatures` alone left the widths unchanged (U4 sweep 2).
