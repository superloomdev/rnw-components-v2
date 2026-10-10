// Info: The role cells the shared presentations read, as data, so a
// component's `api.js` and the library's declared requirements name the
// same list. The field presentation reads every `field` family cell for the
// state a field is in; a member reads its own cell where its reference
// distinguishes it from the family.

// Every `field` family color cell, by part and state
const FIELD_COLORS = Object.freeze([
  'field_container', 'field_container_hover', 'field_container_disabled',
  'field_outline', 'field_outline_hover', 'field_outline_focus', 'field_outline_disabled',
  'field_outline_invalid', 'field_outline_invalid_hover', 'field_outline_invalid_focus',
  'field_ring_invalid', 'field_focus_ring',
  'field_label', 'field_label_hover', 'field_label_focus', 'field_label_disabled',
  'field_label_invalid', 'field_label_invalid_hover', 'field_label_invalid_focus',
  'field_value', 'field_value_disabled', 'field_placeholder', 'field_placeholder_disabled',
  'field_helper', 'field_helper_disabled', 'field_message_invalid',
  'field_indicator', 'field_indicator_hover', 'field_indicator_focus', 'field_indicator_disabled',
  'field_indicator_invalid', 'field_indicator_invalid_hover', 'field_indicator_invalid_focus',
  'field_invalid_icon', 'field_invalid_icon_hover', 'field_invalid_icon_focus'
]);

// The tokens the field presentation reads for every field
export const FIELD_PRESENTATION_TOKENS = Object.freeze([
  'feedback.field', 'anatomy.label', 'spacing.spacing_02', 'spacing.spacing_03', 'font.family.sans',
  'control.field_outline_width', 'control.field_outline_width_focus', 'control.field_invalid_ring_width',
  'control.field_focus_width', 'control.field_focus_offset', 'control.field_padding_inline',
  'control.field_icon_inset', 'control.field_icon_gap', 'control.field_message_inset', 'control.field_message_gap',
  'type.field_value', 'type.field_label', 'type.field_label_raised', 'type.field_helper'
].concat(FIELD_COLORS.map(function (cell) {
  return 'color.' + cell;
})));

// The tokens the list presentation reads: the container, the item fills and
// labels by state, the divider and the item's type set. A consumer that marks
// the selected item declares `anatomy.list_selected_mark` itself
export const LIST_PRESENTATION_TOKENS = Object.freeze([
  'stacking.dropdown', 'shadow.list', 'font.family.sans',
  'control.list_item_height', 'control.list_item_padding_inline', 'control.list_item_divider_width',
  'control.list_padding_block', 'control.list_radius',
  'type.list_item',
  'color.list_container',
  'color.list_item_label', 'color.list_item_label_hover', 'color.list_item_label_selected', 'color.list_item_label_disabled',
  'color.list_item_container_hover', 'color.list_item_container_active',
  'color.list_item_container_selected', 'color.list_item_container_selected_hover',
  'color.list_item_divider'
]);
