// Info: preview__ChatButton spec sheet. Every metric names a token; the
// theme supplies the number. `startPadding` is the Button's own start
// padding (padding less the border), `inlineStartPadding` the same for the
// inline kinds - each stands as the icon-free end padding.

export default Object.freeze({
  startPadding: { tokens: ['control.button_padding_start', 'border.width_01'], operation: 'subtract' },
  inlineStartPadding: { tokens: ['control.button_ghost_padding_start', 'border.width_01'], operation: 'subtract' }
});
