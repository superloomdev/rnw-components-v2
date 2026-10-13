// Info: The library's declared token requirements, exported as data.
//
// REQUIRED_TOKENS is the union of every token name a component's `spec.js`
// names plus the tokens the context itself reads; SUPPORTED_TOKENS adds the
// tokens a component reads optionally. The controls' lists are their own
// `api.js` and `spec.js` (the role cells they read). REQUIRED_ICONS is the
// union of the icon names components draw on their own initiative (a
// checkbox's mark, the invalid icon, a select's dropdown indicator), not the
// names a host passes to `Icon`. The purity test
// asserts these lists against the spec sheets, so a token read that is not
// declared here fails before it reaches a theme.

import buttonApi from './molecule/button/api.js';
import buttonSpec from './molecule/button/spec.js';
import checkboxApi from './molecule/checkbox/api.js';
import checkboxSpec from './molecule/checkbox/spec.js';
import textInputApi from './molecule/text-input/api.js';
import textInputSpec from './molecule/text-input/spec.js';
import textAreaApi from './molecule/text-input/api.text-area.js';
import textAreaSpec from './molecule/text-input/spec.text-area.js';
import selectApi from './composite/select/api.js';
import selectSpec from './composite/select/spec.js';
import dropdownApi from './composite/select/api.dropdown.js';
import dropdownSpec from './composite/select/spec.dropdown.js';
import tagApi from './molecule/tag/api.js';
import tagSpec from './molecule/tag/spec.js';
import progressBarApi from './molecule/progress/api.js';
import progressBarSpec from './molecule/progress/spec.js';
import radioButtonApi from './molecule/radio-button/api.js';
import radioButtonSpec from './molecule/radio-button/spec.js';
import toggleApi from './molecule/switch/api.js';
import toggleSpec from './molecule/switch/spec.js';
import tooltipApi from './molecule/tooltip/api.js';
import tooltipSpec from './molecule/tooltip/spec.js';
import iconButtonApi from './molecule/button/api.icon-button.js';
import iconButtonSpec from './molecule/button/spec.icon-button.js';
import tabsApi from './composite/tabs/api.js';
import tabsSpec from './composite/tabs/spec.js';
import menuApi from './composite/menu/api.js';
import menuSpec from './composite/menu/spec.js';
import modalApi from './composite/modal/api.js';
import modalSpec from './composite/modal/spec.js';
import toastNotificationApi from './molecule/notification/api.toast-notification.js';
import toastNotificationSpec from './molecule/notification/spec.toast-notification.js';
import aspectRatioApi from './molecule/aspect-ratio/api.js';
import aspectRatioSpec from './molecule/aspect-ratio/spec.js';
import dividerApi from './atom/divider/api.js';
import dividerSpec from './atom/divider/spec.js';
import skeletonPlaceholderApi from './atom/skeleton/api.js';
import skeletonPlaceholderSpec from './atom/skeleton/spec.js';
import iconSkeletonApi from './molecule/skeleton/api.icon-skeleton.js';
import iconSkeletonSpec from './molecule/skeleton/spec.icon-skeleton.js';
import linkApi from './molecule/link/api.js';
import linkSpec from './molecule/link/spec.js';
import skeletonIconApi from './molecule/skeleton/api.js';
import skeletonIconSpec from './molecule/skeleton/spec.js';
import skeletonTextApi from './molecule/skeleton/api.skeleton-text.js';
import skeletonTextSpec from './molecule/skeleton/spec.skeleton-text.js';
import buttonSetApi from './molecule/button/api.button-set.js';
import buttonSetSpec from './molecule/button/spec.button-set.js';
import buttonSkeletonApi from './molecule/button/api.button-skeleton.js';
import buttonSkeletonSpec from './molecule/button/spec.button-skeleton.js';
import comboButtonApi from './composite/button/api.js';
import comboButtonSpec from './composite/button/spec.js';
import dangerButtonApi from './molecule/button/api.danger-button.js';
import dangerButtonSpec from './molecule/button/spec.danger-button.js';
import chatButtonApi from './molecule/button/api.preview-chat-button.js';
import chatButtonSpec from './molecule/button/spec.preview-chat-button.js';
import chatButtonSkeletonApi from './molecule/button/api.preview-chat-button-skeleton.js';
import chatButtonSkeletonSpec from './molecule/button/spec.preview-chat-button-skeleton.js';
import primaryButtonApi from './molecule/button/api.primary-button.js';
import primaryButtonSpec from './molecule/button/spec.primary-button.js';
import secondaryButtonApi from './molecule/button/api.secondary-button.js';
import secondaryButtonSpec from './molecule/button/spec.secondary-button.js';

// Tokens `component/context.js` reads whatever the component: the focus ring's trigger
const CONTEXT_TOKENS = [
  'feedback.focus_trigger'
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

/********************************************************************
Every token a component's spec sheet names.

@param {Object} spec - A spec sheet (metric -> token or rule)

@return {Array} - Token names
*********************************************************************/
function specTokens (spec) {

  return Object.keys(spec).flatMap(function (metric) {
    const entry = spec[metric];
    return typeof entry === 'string' ? [entry] : Array.isArray(entry.tokens) ? entry.tokens : [];
  });

}

// The controls read their role cells: each api.js lists them, each spec.js names its geometry
const BUTTON_REQUIRED = [].concat(buttonApi.tokens, specTokens(buttonSpec));
const CHECKBOX_REQUIRED = [].concat(checkboxApi.tokens, specTokens(checkboxSpec));
const TEXT_INPUT_REQUIRED = [].concat(textInputApi.tokens, specTokens(textInputSpec));
const TEXT_AREA_REQUIRED = [].concat(textAreaApi.tokens, specTokens(textAreaSpec));
const SELECT_REQUIRED = [].concat(selectApi.tokens, specTokens(selectSpec));
const DROPDOWN_REQUIRED = [].concat(dropdownApi.tokens, specTokens(dropdownSpec));
const TAG_REQUIRED = [].concat(tagApi.tokens, specTokens(tagSpec));
const PROGRESS_BAR_REQUIRED = [].concat(progressBarApi.tokens, specTokens(progressBarSpec));
const RADIO_BUTTON_REQUIRED = [].concat(radioButtonApi.tokens, specTokens(radioButtonSpec));
const TOGGLE_REQUIRED = [].concat(toggleApi.tokens, specTokens(toggleSpec));
const TOOLTIP_REQUIRED = [].concat(tooltipApi.tokens, specTokens(tooltipSpec));
const ICON_BUTTON_REQUIRED = [].concat(iconButtonApi.tokens, specTokens(iconButtonSpec));
const TABS_REQUIRED = [].concat(tabsApi.tokens, specTokens(tabsSpec));
const MENU_REQUIRED = [].concat(menuApi.tokens, specTokens(menuSpec));
const MODAL_REQUIRED = [].concat(modalApi.tokens, specTokens(modalSpec));
const TOAST_NOTIFICATION_REQUIRED = [].concat(toastNotificationApi.tokens, specTokens(toastNotificationSpec));
const ASPECT_RATIO_REQUIRED = [].concat(aspectRatioApi.tokens, specTokens(aspectRatioSpec));
const DIVIDER_REQUIRED = [].concat(dividerApi.tokens, specTokens(dividerSpec));
const ICON_SKELETON_REQUIRED = [].concat(iconSkeletonApi.tokens, specTokens(iconSkeletonSpec));
const LINK_REQUIRED = [].concat(linkApi.tokens, specTokens(linkSpec));
const SKELETON_ICON_REQUIRED = [].concat(skeletonIconApi.tokens, specTokens(skeletonIconSpec));
const SKELETON_PLACEHOLDER_REQUIRED = [].concat(skeletonPlaceholderApi.tokens, specTokens(skeletonPlaceholderSpec));
const SKELETON_TEXT_REQUIRED = [].concat(skeletonTextApi.tokens, specTokens(skeletonTextSpec));
const BUTTON_SET_REQUIRED = [].concat(buttonSetApi.tokens, specTokens(buttonSetSpec));
const BUTTON_SKELETON_REQUIRED = [].concat(buttonSkeletonApi.tokens, specTokens(buttonSkeletonSpec));
const COMBO_BUTTON_REQUIRED = [].concat(comboButtonApi.tokens, specTokens(comboButtonSpec));
const DANGER_BUTTON_REQUIRED = [].concat(dangerButtonApi.tokens, specTokens(dangerButtonSpec));
const CHAT_BUTTON_REQUIRED = [].concat(chatButtonApi.tokens, specTokens(chatButtonSpec));
const CHAT_BUTTON_SKELETON_REQUIRED = [].concat(chatButtonSkeletonApi.tokens, specTokens(chatButtonSkeletonSpec));
const PRIMARY_BUTTON_REQUIRED = [].concat(primaryButtonApi.tokens, specTokens(primaryButtonSpec));
const SECONDARY_BUTTON_REQUIRED = [].concat(secondaryButtonApi.tokens, specTokens(secondaryButtonSpec));

// The hue cells a Tag `type` reads on demand
const TAG_SUPPORTED = tagApi.colors.map(function (leaf) {
  return 'color.' + leaf;
});


/********************************************************************
Join token lists into one frozen list without repeats, in first-seen
order.

@param {...Array} lists - Token name lists

@return {Array} - Frozen, de-duplicated list
*********************************************************************/
function join (...lists) {

  return Object.freeze(Array.from(new Set([].concat(...lists))));

}


export const REQUIRED_TOKENS = join(CONTEXT_TOKENS, ICON_REQUIRED, TEXT_REQUIRED, BUTTON_REQUIRED, CHECKBOX_REQUIRED, TEXT_INPUT_REQUIRED, TEXT_AREA_REQUIRED, SELECT_REQUIRED, DROPDOWN_REQUIRED, TAG_REQUIRED, PROGRESS_BAR_REQUIRED, RADIO_BUTTON_REQUIRED, TOGGLE_REQUIRED, TOOLTIP_REQUIRED, ICON_BUTTON_REQUIRED, TABS_REQUIRED, MENU_REQUIRED, MODAL_REQUIRED, TOAST_NOTIFICATION_REQUIRED, ASPECT_RATIO_REQUIRED, DIVIDER_REQUIRED, ICON_SKELETON_REQUIRED, LINK_REQUIRED, SKELETON_ICON_REQUIRED, SKELETON_PLACEHOLDER_REQUIRED, SKELETON_TEXT_REQUIRED, BUTTON_SET_REQUIRED, BUTTON_SKELETON_REQUIRED, COMBO_BUTTON_REQUIRED, DANGER_BUTTON_REQUIRED, CHAT_BUTTON_REQUIRED, CHAT_BUTTON_SKELETON_REQUIRED, PRIMARY_BUTTON_REQUIRED, SECONDARY_BUTTON_REQUIRED);

export const SUPPORTED_TOKENS = join(REQUIRED_TOKENS, ICON_SUPPORTED, TEXT_SUPPORTED, VIEW_SUPPORTED, FIELD_SURFACES, TAG_SUPPORTED);

export const REQUIRED_ICONS = Object.freeze(['checked_indicator', 'mixed_indicator', 'invalid', 'dropdown_indicator', 'checkmark_filled', 'error_filled', 'switch_checked_indicator', 'selected_indicator', 'close', 'information_filled', 'warning_filled', 'chevron_down']);
