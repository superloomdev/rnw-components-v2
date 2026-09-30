// Info: The library's declared token requirements, exported as data.
//
// REQUIRED_TOKENS is the union of every token name a component's `spec.js`
// names plus the tokens the context itself reads; SUPPORTED_TOKENS adds the
// tokens a component reads optionally. REQUIRED_ICONS is the union of the
// icon names components draw on their own initiative (a checkbox's mark, a
// select's caret), not the names a host passes to `Icon`. The purity test
// asserts these lists against the spec sheets, so a token read that is not
// declared here fails before it reaches a theme.

// Tokens `component/context.js` reads for every component
const CONTEXT_TOKENS = [
  'color.focus',
  'feedback.focus',
  'focus.offset',
  'focus.width'
];

// Tokens the press presentation reads, for every component that calls it
const PRESS_TOKENS = [
  'feedback.press', 'state.hover_opacity', 'state.pressed_opacity', 'state.focus_opacity',
  'motion.duration_fast_01', 'motion.easing_standard_productive'
];

// Tokens the field presentation reads, for every component that calls it
const FIELD_TOKENS = [
  'feedback.field', 'anatomy.label', 'border.width_01', 'border.width_02', 'spacing.spacing_02', 'spacing.spacing_03',
  'type.label01', 'type.body_compact_01', 'font.family.sans',
  'color.border_disabled', 'color.support_error', 'color.border_strong_01',
  'color.field_01', 'color.field_hover_01', 'color.text_disabled', 'color.text_secondary'
];

// Surfaces a field may sit on; its floating label occludes the border with one
const FIELD_SURFACES = ['color.background', 'color.layer_01', 'color.layer_02', 'color.layer_03'];

// Tokens each component's spec.js and api.js name (required = always read)
const ICON_REQUIRED = ['size.icon_02', 'color.icon_primary'];
const ICON_SUPPORTED = [
  'color.icon_secondary', 'color.icon_interactive', 'color.icon_disabled',
  'color.icon_inverse', 'color.icon_on_color', 'color.icon_on_color_disabled'
];

const TEXT_REQUIRED = ['type.body_compact_02', 'color.text_primary', 'font.family.sans'];
const TEXT_SUPPORTED = [
  'color.text_secondary', 'color.text_placeholder', 'color.text_helper', 'color.text_error',
  'color.text_disabled', 'color.text_inverse', 'color.text_on_color', 'color.text_on_color_disabled', 'color.link_primary'
];

const VIEW_SUPPORTED = [
  'color.background', 'color.layer_01', 'color.layer_02', 'color.layer_03',
  'color.layer_accent_01', 'color.layer_accent_02', 'color.layer_accent_03',
  'color.field_01', 'color.field_02', 'color.field_03', 'color.background_inverse', 'color.background_brand',
  'color.border_subtle_00', 'color.border_subtle_01', 'color.border_subtle_02', 'color.border_subtle_03',
  'color.border_strong_01', 'color.border_strong_02', 'color.border_strong_03',
  'color.border_interactive', 'color.border_inverse', 'color.border_disabled',
  'color.border_tile_01', 'color.border_tile_02', 'color.border_tile_03'
];

const BUTTON_REQUIRED = [].concat(PRESS_TOKENS, [
  'size.size_large', 'size.size_xsmall', 'size.size_small', 'size.size_medium', 'size.size_xlarge', 'size.size_2xlarge',
  'border.width_01', 'spacing.spacing_05', 'spacing.spacing_10', 'spacing.spacing_03', 'size.icon_01', 'shape.radius_00',
  'type.body_compact_01', 'font.family.sans', 'shadow.level_01',
  'color.button_primary', 'color.button_primary_hover', 'color.button_primary_active', 'color.text_on_color',
  'color.button_disabled', 'color.text_on_color_disabled', 'color.text_disabled', 'color.border_disabled'
]);
const BUTTON_SUPPORTED = [
  'color.button_secondary', 'color.button_secondary_hover', 'color.button_secondary_active',
  'color.button_tertiary', 'color.button_tertiary_hover', 'color.button_tertiary_active', 'color.text_inverse',
  'color.background_hover', 'color.background_active', 'color.link_primary',
  'color.button_danger_primary', 'color.button_danger_secondary', 'color.button_danger_hover', 'color.button_danger_active',
  'color.layer_accent_01', 'color.layer_accent_hover_01', 'color.layer_accent_active_01', 'color.text_primary',
  'color.layer_01', 'color.layer_hover_01', 'color.layer_active_01', 'color.interactive'
];

const CHECKBOX_REQUIRED = [].concat(PRESS_TOKENS, [
  'size.icon_01', 'border.width_01', 'shape.radius_02', 'spacing.spacing_03', 'spacing.spacing_04', 'spacing.spacing_01',
  'spacing.spacing_05', 'size.size_medium', 'shape.radius_max', 'spacing.spacing_02',
  'type.body_compact_01', 'type.helper_text_01', 'font.family.sans',
  'color.icon_primary', 'color.icon_inverse', 'color.icon_disabled', 'color.support_error',
  'color.text_primary', 'color.text_disabled', 'color.text_error', 'color.text_helper'
]);

const TEXT_INPUT_REQUIRED = [].concat(FIELD_TOKENS, [
  'size.size_medium', 'size.size_small', 'size.size_large', 'spacing.spacing_05', 'shape.radius_00', 'size.icon_01',
  'type.helper_text_01', 'color.text_primary', 'color.text_placeholder', 'color.text_error', 'color.text_helper'
]);

const SELECT_REQUIRED = [].concat(FIELD_TOKENS, [
  'anatomy.caret', 'size.size_medium', 'size.size_small', 'size.size_large', 'spacing.spacing_05', 'shape.radius_00',
  'size.icon_01', 'stacking.dropdown', 'shadow.level_02', 'type.helper_text_01',
  'color.text_primary', 'color.text_placeholder', 'color.text_error', 'color.text_helper',
  'color.icon_primary', 'color.icon_disabled', 'color.layer_01', 'color.layer_hover_01', 'color.layer_selected_01'
]);


/********************************************************************
Join token lists into one frozen list without repeats, in first-seen
order.

@param {...Array} lists - Token name lists

@return {Array} - Frozen, de-duplicated list
*********************************************************************/
function join (...lists) {

  return Object.freeze(Array.from(new Set([].concat(...lists))));

}


export const REQUIRED_TOKENS = join(CONTEXT_TOKENS, ICON_REQUIRED, TEXT_REQUIRED, BUTTON_REQUIRED, CHECKBOX_REQUIRED, TEXT_INPUT_REQUIRED, SELECT_REQUIRED);

export const SUPPORTED_TOKENS = join(REQUIRED_TOKENS, ICON_SUPPORTED, TEXT_SUPPORTED, VIEW_SUPPORTED, BUTTON_SUPPORTED, FIELD_SURFACES);

export const REQUIRED_ICONS = Object.freeze(['checkmark', 'subtract', 'warning_filled', 'chevron_down']);
