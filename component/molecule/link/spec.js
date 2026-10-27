// Info: Link spec sheet. `focusWidth`/`focusOffset` are the keyboard-focus
// ring (1 out, as the rendered reference draws a focused link),
// `pressOffset` the ring while pressed (at the edge); `iconGap`, `iconSize`
// and `iconSizeLarge` size the trailing icon. Every metric names a token or
// a declared constant; the theme supplies the numbers.

export default Object.freeze({
  focusWidth: 'control.link_focus_width',
  focusOffset: { constant: 1 },
  pressOffset: { constant: 0 },
  iconGap: 'control.link_icon_gap',
  iconSize: 'control.link_icon_size',
  iconSizeLarge: 'control.link_icon_size_large'
});
