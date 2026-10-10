// Info: Modal public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Modal',
  props: Object.freeze({
    open: { type: 'boolean', required: true, description: 'Whether the dialog shows. The caller owns the state; `onClose` asks for a close.' },
    onClose: { type: 'function', required: false, description: 'Called on Escape, the close button, and outside press unless `preventCloseOnClickOutside`.' },
    title: { type: 'string', required: true, description: 'The heading text; names the dialog unless `accessibilityLabel` is given.' },
    label: { type: 'string', required: false, description: 'The eyebrow text above the heading.' },
    children: { type: 'node', required: false, description: 'The body content.' },
    actions: { type: 'array', required: false, description: 'Buttons: { label, onPress, kind, disabled }. The last is the primary; an action may override its `kind`. Ignored when `passive`.' },
    size: { type: 'string', required: false, description: 'One of `xs`, `sm`, `md`, `lg`: the width step of the percentage-width rule. Default `md`.' },
    alert: { type: 'boolean', required: false, description: 'Announces `alertdialog` and ties the body with `aria-describedby`.' },
    passive: { type: 'boolean', required: false, description: 'Draws no actions row; the dialog dismisses on outside press.' },
    preventCloseOnClickOutside: { type: 'boolean', required: false, description: 'Keeps outside presses from calling `onClose`.' },
    closeLabel: { type: 'string', required: false, description: 'Accessible name of the close button. Default `Close`.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name; the heading names the dialog when this is not given.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the dialog container.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['xs', 'sm', 'md', 'lg']),
  tokens: Object.freeze([
    'anatomy.dialog_actions', 'anatomy.dialog_close', 'anatomy.dialog_label', 'stacking.overlay',
    'color.dialog_scrim', 'color.dialog_container', 'color.dialog_border', 'color.dialog_heading', 'color.dialog_body', 'color.text_secondary',
    'control.dialog_border_width', 'control.dialog_radius', 'control.dialog_min_width', 'control.dialog_max_width',
    'control.dialog_padding_inline', 'control.dialog_padding_top', 'control.dialog_header_gap',
    'control.dialog_body_padding_top', 'control.dialog_body_padding_bottom', 'control.dialog_header_space', 'control.dialog_min_height',
    'control.dialog_actions_height', 'control.dialog_actions_gap', 'control.dialog_actions_padding', 'control.dialog_close_icon_size',
    'control.icon_button_size', 'spacing.spacing_05', 'shadow.dialog',
    'type.dialog_heading', 'type.dialog_body', 'type.label01', 'font.family.sans',
    'icon.close'
  ])
});
