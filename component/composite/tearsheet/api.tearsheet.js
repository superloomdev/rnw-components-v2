// Info: Tearsheet public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Tearsheet',
  props: Object.freeze({
    open: { type: 'boolean', required: true, description: 'Whether the tearsheet shows. The caller owns the state; `onClose` asks for a close.' },
    onClose: { type: 'function', required: false, description: 'Called on Escape, the close button and a passive tearsheet\'s outside press. Returning `false` vetoes the close.' },
    label: { type: 'string', required: false, description: 'The eyebrow label above the title.' },
    title: { type: 'string', required: false, description: 'The heading text; names the dialog when `accessibilityLabel` is not given.' },
    description: { type: 'string', required: false, description: 'Supporting text under the heading, capped at the description share of the header width.' },
    navigation: { type: 'node', required: false, description: 'A navigation block under the header text.' },
    headerActions: { type: 'node', required: false, description: 'Extra actions beside the header.' },
    hasCloseIcon: { type: 'boolean', required: false, description: 'Draws the close button. Default: a tearsheet with no actions (passive).' },
    closeIconDescription: { type: 'string', required: false, description: 'The close button\'s accessible name. Default `Close`.' },
    influencer: { type: 'node', required: false, description: 'A side panel inside the body.' },
    influencerPosition: { type: 'string', required: false, description: 'One of `left`, `right`. Left spans the body height beside main; right sits inside main above the action row. Default `left`.' },
    influencerWidth: { type: 'string', required: false, description: 'One of `narrow`, `wide`. Default `narrow`.' },
    actions: { type: 'array', required: false, description: 'Action buttons `[{ label, kind, onPress, disabled }]`, kind one of `ghost`, `secondary`, `primary`, `danger`. Order drawn: ghost, secondary, primary.' },
    verticalPosition: { type: 'string', required: false, description: 'One of `normal`, `lower`: the container\'s top inset. Default `normal`.' },
    children: { type: 'node', required: false, description: 'The main content.' },
    returnFocusRef: { type: 'object', required: false, description: 'Ref of the launcher; focused when the tearsheet closes.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name; the title names the dialog when this is not given.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the container.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['narrow', 'wide']),
  tokens: Object.freeze([
    'anatomy.dialog_close', 'stacking.overlay',
    'color.dialog_scrim', 'color.dialog_container', 'color.dialog_border', 'color.dialog_heading', 'color.text_secondary',
    'color.tearsheet_divider', 'color.tearsheet_header_container', 'color.tearsheet_influencer_container',
    'color.tearsheet_main_container', 'color.tearsheet_actions_container',
    'control.dialog_border_width', 'control.dialog_close_icon_size', 'control.icon_button_size',
    'control.tearsheet_inset_inline', 'control.tearsheet_inset_top', 'control.tearsheet_inset_top_lower',
    'control.tearsheet_stack_offset', 'control.tearsheet_enter_offset',
    'control.tearsheet_header_height', 'control.tearsheet_header_padding_end',
    'control.tearsheet_header_padding_block', 'control.tearsheet_header_padding_inline',
    'control.tearsheet_description_gap', 'control.tearsheet_description_max_ratio', 'control.tearsheet_navigation_gap',
    'control.tearsheet_influencer_width', 'control.tearsheet_influencer_width_wide',
    'control.tearsheet_divider_width', 'control.tearsheet_action_height',
    'control.tearsheet_action_padding_top', 'control.tearsheet_action_padding_bottom', 'control.tearsheet_action_max_width',
    'control.dialog_header_gap',
    'border.width_01', 'type.label01', 'type.body_compact_01', 'type.tearsheet_heading', 'type.tearsheet_description',
    'spacing.spacing_03', 'spacing.spacing_05', 'font.family.sans', 'motion.duration_moderate_02', 'icon.close'
  ])
});
