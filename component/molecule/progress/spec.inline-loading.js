// Info: InlineLoading spec sheet. Every metric names a token; the theme
// supplies the number. The mark's gap is the inline-loading family's own
// cell; the row's minimum height is the small size step; the status marks
// are the first icon size. `successDelay` is a declared constant - the
// upstream default, API surface, not a theme value (InlineLoading.js:26).

export default Object.freeze({
  gap: 'control.inline_loading_gap',
  minHeight: 'size.size_small',
  iconSize: 'size.icon_01',
  successDelay: { constant: 1500 }
});
