// Info: CopyButton's public API and the tokens it reads.

export default Object.freeze({
  name: 'CopyButton',
  props: Object.freeze({
    iconDescription: { type: 'string', required: true, description: 'The tooltip text at rest; it is also the button\'s accessible name.' },
    feedback: { type: 'string', required: false, description: 'The tooltip text while the copy feedback shows. Default `Copied!`.' },
    feedbackTimeout: { type: 'number', required: false, description: 'Milliseconds the feedback text stays. Default 2000.' },
    align: { type: 'string', required: false, description: 'The tooltip\'s side and alignment (the Tooltip `align` vocabulary). Default `bottom`.' },
    size: { type: 'string', required: false, description: 'The button\'s size: `sm`, `md`, `lg`. Default `md`.' },
    onClick: { type: 'function', required: true, description: 'Called once per press; the host does the clipboard write.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.copy_button_container', 'color.copy_button_container_hover', 'color.copy_button_container_active',
    'color.icon_primary', 'color.icon_inverse',
    'size.size_small', 'size.size_medium', 'size.size_large',
    'feedback.press', 'feedback.focus_trigger', 'motion.duration_fast_02'
  ]),
  colors: Object.freeze([])
});
