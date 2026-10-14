// Info: Link spec sheet. `focusWidth`/`focusOffset` are the ring (drawn at
// the edge, offset a constant 0 - the primary's focus outline sits at the
// edge); `iconGap`, `iconSize` and `iconSizeLarge` size the trailing icon.
// Every metric names a token or a declared constant; the theme supplies
// the numbers.

export default Object.freeze({
  focusWidth: 'control.link_focus_width',
  focusOffset: { constant: 0 },
  iconGap: 'control.link_icon_gap',
  iconSize: 'control.link_icon_size',
  iconSizeLarge: 'control.link_icon_size_large'
});
