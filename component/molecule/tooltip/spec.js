// Info: Tooltip spec sheet. Every metric names a token; the theme supplies
// the number. `delayOpen`/`delayClose` are decisions: the references' 100 ms
// open delay and 300 ms close, the compact form the icon button's 100 ms.
// `caretSide` is geometry: the square whose rotated half, clipped to
// `caretWidth` x `caretHeight`, is the caret triangle.

export default Object.freeze({
  paddingBlock: 'control.tooltip_padding_block',
  paddingInline: 'control.tooltip_padding_inline',
  radius: 'control.tooltip_radius',
  caretWidth: 'control.tooltip_caret_width',
  caretHeight: 'control.tooltip_caret_height',
  offset: 'control.tooltip_offset',
  maxWidth: 'control.tooltip_max_width',
  paddingBlockCompact: 'control.tooltip_compact_padding_block',
  caretWidthCompact: 'control.tooltip_compact_caret_width',
  caretHeightCompact: 'control.tooltip_compact_caret_height',
  offsetCompact: 'control.tooltip_compact_offset',
  level: 'stacking.floating',
  delayOpen: { constant: 100 },
  delayClose: { constant: 300 },
  delayCloseCompact: { constant: 100 }
});
