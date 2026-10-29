// Info: ModalBody public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more. ModalBody must be composed inside ComposedModal.

export default Object.freeze({
  name: 'ModalBody',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The body content; a string draws as `type.dialog_body` prose.' },
    hasScrollingContent: { type: 'boolean', required: false, description: 'Scrolls the body; a measured overflow scrolls too.' },
    hasForm: { type: 'boolean', required: false, description: 'Drops the prose end gutter for a form body.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name of the scrolling region; the heading names it when this is not given.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'anatomy.dialog_scroll_fade',
    'color.dialog_body', 'color.dialog_container',
    'control.dialog_body_padding_top', 'control.dialog_body_padding_bottom', 'control.dialog_padding_inline',
    'control.dialog_scroll_fade_height', 'control.dialog_scroll_fade_min_height', 'control.dialog_scroll_fade_start', 'control.dialog_scroll_end_space',
    'type.dialog_body', 'font.family.sans'
  ])
});
