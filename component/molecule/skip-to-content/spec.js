// Info: SkipToContent spec sheet. `offset` is the focused link's inset
// from the top start of its containing block: upstream's rest rule
// `margin: -1px` is not reset by the focus rule (_header.scss:436-447).

export default Object.freeze({
  offset: { constant: -1 },
  height: 'control.skip_link_height',
  paddingInline: 'control.skip_link_padding_inline',
  borderWidth: 'control.skip_link_border_width',
  level: 'stacking.skip_link'
});
