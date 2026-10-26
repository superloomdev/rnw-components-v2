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
import checkboxSkeletonApi from './molecule/checkbox/api.checkbox-skeleton.js';
import checkboxSkeletonSpec from './molecule/checkbox/spec.checkbox-skeleton.js';
import checkboxGroupApi from './molecule/checkbox/api.checkbox-group.js';
import checkboxGroupSpec from './molecule/checkbox/spec.checkbox-group.js';
import textInputApi from './molecule/text-input/api.js';
import textInputSpec from './molecule/text-input/spec.js';
import textAreaApi from './molecule/text-input/api.text-area.js';
import textAreaSpec from './molecule/text-input/spec.text-area.js';
import passwordInputApi from './molecule/text-input/api.password-input.js';
import passwordInputSpec from './molecule/text-input/spec.password-input.js';
import textInputSkeletonApi from './molecule/text-input/api.text-input-skeleton.js';
import textInputSkeletonSpec from './molecule/text-input/spec.text-input-skeleton.js';
import textAreaSkeletonApi from './molecule/text-input/api.text-area-skeleton.js';
import textAreaSkeletonSpec from './molecule/text-input/spec.text-area-skeleton.js';
import timePickerApi from './molecule/text-input/api.time-picker.js';
import timePickerSpec from './molecule/text-input/spec.time-picker.js';
import timePickerSelectApi from './molecule/text-input/api.time-picker-select.js';
import timePickerSelectSpec from './molecule/text-input/spec.time-picker-select.js';
import numberInputApi from './molecule/number-input/api.js';
import numberInputSpec from './molecule/number-input/spec.js';
import numberInputSkeletonApi from './molecule/number-input/api.number-input-skeleton.js';
import numberInputSkeletonSpec from './molecule/number-input/spec.number-input-skeleton.js';
import searchApi from './molecule/search/api.js';
import searchSpec from './molecule/search/spec.js';
import expandableSearchApi from './molecule/search/api.expandable-search.js';
import expandableSearchSpec from './molecule/search/spec.expandable-search.js';
import searchSkeletonApi from './molecule/search/api.search-skeleton.js';
import searchSkeletonSpec from './molecule/search/spec.search-skeleton.js';
import sliderApi from './molecule/slider/api.js';
import sliderSpec from './molecule/slider/spec.js';
import sliderSkeletonApi from './molecule/slider/api.slider-skeleton.js';
import sliderSkeletonSpec from './molecule/slider/spec.slider-skeleton.js';
import selectApi from './composite/select/api.js';
import selectSpec from './composite/select/spec.js';
import dropdownApi from './composite/select/api.dropdown.js';
import dropdownSpec from './composite/select/spec.dropdown.js';
import selectSkeletonApi from './composite/select/api.select-skeleton.js';
import selectSkeletonSpec from './composite/select/spec.select-skeleton.js';
import dropdownSkeletonApi from './composite/select/api.dropdown-skeleton.js';
import dropdownSkeletonSpec from './composite/select/spec.dropdown-skeleton.js';
import multiSelectApi from './composite/select/api.multi-select.js';
import multiSelectSpec from './composite/select/spec.multi-select.js';
import filterableMultiSelectApi from './composite/select/api.filterable-multi-select.js';
import filterableMultiSelectSpec from './composite/select/spec.filterable-multi-select.js';
import selectItemApi from './composite/select/api.select-item.js';
import selectItemSpec from './composite/select/spec.select-item.js';
import selectItemGroupApi from './composite/select/api.select-item-group.js';
import selectItemGroupSpec from './composite/select/spec.select-item-group.js';
import fabApi from './molecule/floating-action-button/api.floating-action-button.js';
import fabSpec from './molecule/floating-action-button/spec.floating-action-button.js';
import comboBoxApi from './composite/select/api.combo-box.js';
import comboBoxSpec from './composite/select/spec.combo-box.js';
import tagApi from './molecule/tag/api.js';
import tagSpec from './molecule/tag/spec.js';
import progressBarApi from './molecule/progress/api.js';
import progressBarSpec from './molecule/progress/spec.js';
import radioButtonApi from './molecule/radio-button/api.js';
import radioButtonSpec from './molecule/radio-button/spec.js';
import radioButtonSkeletonApi from './molecule/radio-button/api.radio-button-skeleton.js';
import radioButtonSkeletonSpec from './molecule/radio-button/spec.radio-button-skeleton.js';
import radioButtonGroupApi from './molecule/radio-button/api.radio-button-group.js';
import radioButtonGroupSpec from './molecule/radio-button/spec.radio-button-group.js';
import toggleApi from './molecule/switch/api.js';
import toggleSpec from './molecule/switch/spec.js';
import tooltipApi from './molecule/tooltip/api.js';
import tooltipSpec from './molecule/tooltip/spec.js';
import popoverApi from './molecule/popover/api.js';
import popoverSpec from './molecule/popover/spec.js';
import popoverContentApi from './molecule/popover/api.popover-content.js';
import popoverContentSpec from './molecule/popover/spec.popover-content.js';
import definitionTooltipApi from './molecule/tooltip/api.definition-tooltip.js';
import definitionTooltipSpec from './molecule/tooltip/spec.definition-tooltip.js';
import toggletipApi from './molecule/tooltip/api.toggletip.js';
import toggletipSpec from './molecule/tooltip/spec.toggletip.js';
import toggletipLabelApi from './molecule/tooltip/api.toggletip-label.js';
import toggletipLabelSpec from './molecule/tooltip/spec.toggletip-label.js';
import toggletipButtonApi from './molecule/tooltip/api.toggletip-button.js';
import toggletipButtonSpec from './molecule/tooltip/spec.toggletip-button.js';
import toggletipContentApi from './molecule/tooltip/api.toggletip-content.js';
import toggletipContentSpec from './molecule/tooltip/spec.toggletip-content.js';
import toggletipActionsApi from './molecule/tooltip/api.toggletip-actions.js';
import toggletipActionsSpec from './molecule/tooltip/spec.toggletip-actions.js';
import tagSetApi from './molecule/tag/api.tag-set.js';
import tagSetSpec from './molecule/tag/spec.tag-set.js';
import iconButtonApi from './molecule/button/api.icon-button.js';
import iconButtonSpec from './molecule/button/spec.icon-button.js';
import tabsApi from './composite/tabs/api.js';
import tabsSpec from './composite/tabs/spec.js';
import tabApi from './composite/tabs/api.tab.js';
import tabSpec from './composite/tabs/spec.tab.js';
import tabListApi from './composite/tabs/api.tab-list.js';
import tabListSpec from './composite/tabs/spec.tab-list.js';
import tabPanelApi from './composite/tabs/api.tab-panel.js';
import tabPanelsApi from './composite/tabs/api.tab-panels.js';
import iconTabApi from './composite/tabs/api.icon-tab.js';
import iconTabSpec from './composite/tabs/spec.icon-tab.js';
import tabsVerticalApi from './composite/tabs/api.tabs-vertical.js';
import tabsVerticalSpec from './composite/tabs/spec.tabs-vertical.js';
import tabListVerticalApi from './composite/tabs/api.tab-list-vertical.js';
import tabListVerticalSpec from './composite/tabs/spec.tab-list-vertical.js';
import tabsSkeletonApi from './composite/tabs/api.tabs-skeleton.js';
import tabsSkeletonSpec from './composite/tabs/spec.tabs-skeleton.js';
import contentSwitcherApi from './composite/tabs/api.content-switcher.js';
import contentSwitcherSpec from './composite/tabs/spec.content-switcher.js';
import switchApi from './molecule/content-switcher/api.switch.js';
import switchSpec from './molecule/content-switcher/spec.switch.js';
import iconSwitchApi from './molecule/content-switcher/api.icon-switch.js';
import iconSwitchSpec from './molecule/content-switcher/spec.icon-switch.js';
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
import primaryButtonApi from './molecule/button/api.primary-button.js';
import primaryButtonSpec from './molecule/button/spec.primary-button.js';
import secondaryButtonApi from './molecule/button/api.secondary-button.js';
import secondaryButtonSpec from './molecule/button/spec.secondary-button.js';
import dismissibleTagApi from './molecule/tag/api.dismissible-tag.js';
import dismissibleTagSpec from './molecule/tag/spec.dismissible-tag.js';
import operationalTagApi from './molecule/tag/api.operational-tag.js';
import operationalTagSpec from './molecule/tag/spec.operational-tag.js';
import selectableTagApi from './molecule/tag/api.selectable-tag.js';
import selectableTagSpec from './molecule/tag/spec.selectable-tag.js';
import tagSkeletonApi from './molecule/tag/api.tag-skeleton.js';
import tagSkeletonSpec from './molecule/tag/spec.tag-skeleton.js';
import loadingApi from './atom/loading/api.js';
import loadingSpec from './atom/loading/spec.js';
import inlineLoadingApi from './molecule/progress/api.inline-loading.js';
import inlineLoadingSpec from './molecule/progress/spec.inline-loading.js';
import progressIndicatorApi from './molecule/progress/api.progress-indicator.js';
import progressIndicatorSpec from './molecule/progress/spec.progress-indicator.js';
import progressStepApi from './molecule/progress/api.progress-step.js';
import progressStepSpec from './molecule/progress/spec.progress-step.js';
import progressIndicatorSkeletonApi from './molecule/progress/api.progress-indicator-skeleton.js';
import progressIndicatorSkeletonSpec from './molecule/progress/spec.progress-indicator-skeleton.js';
import formApi from './molecule/form/api.js';
import formSpec from './molecule/form/spec.js';
import formGroupApi from './molecule/form/api.form-group.js';
import formGroupSpec from './molecule/form/spec.form-group.js';
import formItemApi from './molecule/form/api.form-item.js';
import formItemSpec from './molecule/form/spec.form-item.js';
import formLabelApi from './molecule/form/api.form-label.js';
import formLabelSpec from './molecule/form/spec.form-label.js';
import headingApi from './molecule/heading/api.js';
import headingSpec from './molecule/heading/spec.js';
import sectionApi from './molecule/heading/api.section.js';
import sectionSpec from './molecule/heading/spec.section.js';
import hstackApi from './molecule/stack/api.hstack.js';
import hstackSpec from './molecule/stack/spec.hstack.js';
import stackApi from './molecule/stack/api.js';
import stackSpec from './molecule/stack/spec.js';
import vstackApi from './molecule/stack/api.vstack.js';
import vstackSpec from './molecule/stack/spec.vstack.js';
import toggleSkeletonApi from './molecule/switch/api.toggle-skeleton.js';
import toggleSkeletonSpec from './molecule/switch/spec.toggle-skeleton.js';
import layerApi from './provider/layer/api.js';
import layerSpec from './provider/layer/spec.js';

// Tokens `component/context.js` reads whatever the component: the focus ring's trigger
const CONTEXT_TOKENS = [
  'control.target_min',
  'control.text_scale_max',
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
const POPOVER_REQUIRED = [].concat(popoverApi.tokens, specTokens(popoverSpec));
const POPOVER_CONTENT_REQUIRED = [].concat(popoverContentApi.tokens, specTokens(popoverContentSpec));
const DEFINITION_TOOLTIP_REQUIRED = [].concat(definitionTooltipApi.tokens, specTokens(definitionTooltipSpec));
const TOGGLETIP_REQUIRED = [].concat(toggletipApi.tokens, specTokens(toggletipSpec));
const TOGGLETIP_LABEL_REQUIRED = [].concat(toggletipLabelApi.tokens, specTokens(toggletipLabelSpec));
const TOGGLETIP_BUTTON_REQUIRED = [].concat(toggletipButtonApi.tokens, specTokens(toggletipButtonSpec));
const TOGGLETIP_CONTENT_REQUIRED = [].concat(toggletipContentApi.tokens, specTokens(toggletipContentSpec));
const TOGGLETIP_ACTIONS_REQUIRED = [].concat(toggletipActionsApi.tokens, specTokens(toggletipActionsSpec));
const TAG_SET_REQUIRED = [].concat(tagSetApi.tokens, specTokens(tagSetSpec));
const ICON_BUTTON_REQUIRED = [].concat(iconButtonApi.tokens, specTokens(iconButtonSpec));
const TABS_REQUIRED = [].concat(tabsApi.tokens, specTokens(tabsSpec));
const TAB_REQUIRED = [].concat(tabApi.tokens, specTokens(tabSpec));
const TAB_LIST_REQUIRED = [].concat(tabListApi.tokens, specTokens(tabListSpec));
const TAB_PANEL_REQUIRED = [].concat(tabPanelApi.tokens);
const TAB_PANELS_REQUIRED = [].concat(tabPanelsApi.tokens);
const ICON_TAB_REQUIRED = [].concat(iconTabApi.tokens, specTokens(iconTabSpec));
const TABS_VERTICAL_REQUIRED = [].concat(tabsVerticalApi.tokens, specTokens(tabsVerticalSpec));
const TAB_LIST_VERTICAL_REQUIRED = [].concat(tabListVerticalApi.tokens, specTokens(tabListVerticalSpec));
const TABS_SKELETON_REQUIRED = [].concat(tabsSkeletonApi.tokens, specTokens(tabsSkeletonSpec));
const CONTENT_SWITCHER_REQUIRED = [].concat(contentSwitcherApi.tokens, specTokens(contentSwitcherSpec));
const SWITCH_REQUIRED = [].concat(switchApi.tokens, specTokens(switchSpec));
const ICON_SWITCH_REQUIRED = [].concat(iconSwitchApi.tokens, specTokens(iconSwitchSpec));
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
const PRIMARY_BUTTON_REQUIRED = [].concat(primaryButtonApi.tokens, specTokens(primaryButtonSpec));
const SECONDARY_BUTTON_REQUIRED = [].concat(secondaryButtonApi.tokens, specTokens(secondaryButtonSpec));
const DISMISSIBLE_TAG_REQUIRED = [].concat(dismissibleTagApi.tokens, specTokens(dismissibleTagSpec));
const OPERATIONAL_TAG_REQUIRED = [].concat(operationalTagApi.tokens, specTokens(operationalTagSpec));
const SELECTABLE_TAG_REQUIRED = [].concat(selectableTagApi.tokens, specTokens(selectableTagSpec));
const TAG_SKELETON_REQUIRED = [].concat(tagSkeletonApi.tokens, specTokens(tagSkeletonSpec));
const LOADING_REQUIRED = [].concat(loadingApi.tokens, specTokens(loadingSpec));
const INLINE_LOADING_REQUIRED = [].concat(inlineLoadingApi.tokens, specTokens(inlineLoadingSpec));
const PROGRESS_INDICATOR_REQUIRED = [].concat(progressIndicatorApi.tokens, specTokens(progressIndicatorSpec));
const PROGRESS_STEP_REQUIRED = [].concat(progressStepApi.tokens, specTokens(progressStepSpec));
const PROGRESS_INDICATOR_SKELETON_REQUIRED = [].concat(progressIndicatorSkeletonApi.tokens, specTokens(progressIndicatorSkeletonSpec));
const FORM_REQUIRED = [].concat(formApi.tokens, specTokens(formSpec));
const FORM_GROUP_REQUIRED = [].concat(formGroupApi.tokens, specTokens(formGroupSpec));
const FORM_ITEM_REQUIRED = [].concat(formItemApi.tokens, specTokens(formItemSpec));
const FORM_LABEL_REQUIRED = [].concat(formLabelApi.tokens, specTokens(formLabelSpec));
const HEADING_REQUIRED = [].concat(headingApi.tokens, specTokens(headingSpec));
const SECTION_REQUIRED = [].concat(sectionApi.tokens, specTokens(sectionSpec));
const HSTACK_REQUIRED = [].concat(hstackApi.tokens, specTokens(hstackSpec));
const STACK_REQUIRED = [].concat(stackApi.tokens, specTokens(stackSpec));
const VSTACK_REQUIRED = [].concat(vstackApi.tokens, specTokens(vstackSpec));
const TOGGLE_SKELETON_REQUIRED = [].concat(toggleSkeletonApi.tokens, specTokens(toggleSkeletonSpec));
const LAYER_REQUIRED = [].concat(layerApi.tokens, specTokens(layerSpec));
const PASSWORD_INPUT_REQUIRED = [].concat(passwordInputApi.tokens, specTokens(passwordInputSpec));
const TEXT_INPUT_SKELETON_REQUIRED = [].concat(textInputSkeletonApi.tokens, specTokens(textInputSkeletonSpec));
const TEXT_AREA_SKELETON_REQUIRED = [].concat(textAreaSkeletonApi.tokens, specTokens(textAreaSkeletonSpec));
const TIME_PICKER_REQUIRED = [].concat(timePickerApi.tokens, specTokens(timePickerSpec));
const TIME_PICKER_SELECT_REQUIRED = [].concat(timePickerSelectApi.tokens, specTokens(timePickerSelectSpec));
const NUMBER_INPUT_REQUIRED = [].concat(numberInputApi.tokens, specTokens(numberInputSpec));
const NUMBER_INPUT_SKELETON_REQUIRED = [].concat(numberInputSkeletonApi.tokens, specTokens(numberInputSkeletonSpec));
const SEARCH_REQUIRED = [].concat(searchApi.tokens, specTokens(searchSpec));
const EXPANDABLE_SEARCH_REQUIRED = [].concat(expandableSearchApi.tokens, specTokens(expandableSearchSpec));
const SEARCH_SKELETON_REQUIRED = [].concat(searchSkeletonApi.tokens, specTokens(searchSkeletonSpec));
const CHECKBOX_SKELETON_REQUIRED = [].concat(checkboxSkeletonApi.tokens, specTokens(checkboxSkeletonSpec));
const RADIO_BUTTON_SKELETON_REQUIRED = [].concat(radioButtonSkeletonApi.tokens, specTokens(radioButtonSkeletonSpec));
const CHECKBOX_GROUP_REQUIRED = [].concat(checkboxGroupApi.tokens, specTokens(checkboxGroupSpec));
const RADIO_BUTTON_GROUP_REQUIRED = [].concat(radioButtonGroupApi.tokens, specTokens(radioButtonGroupSpec));
const SLIDER_REQUIRED = [].concat(sliderApi.tokens, specTokens(sliderSpec));
const SLIDER_SKELETON_REQUIRED = [].concat(sliderSkeletonApi.tokens, specTokens(sliderSkeletonSpec));
const SELECT_SKELETON_REQUIRED = [].concat(selectSkeletonApi.tokens, specTokens(selectSkeletonSpec));
const DROPDOWN_SKELETON_REQUIRED = [].concat(dropdownSkeletonApi.tokens, specTokens(dropdownSkeletonSpec));
const MULTI_SELECT_REQUIRED = [].concat(multiSelectApi.tokens, specTokens(multiSelectSpec));
const FILTERABLE_MULTI_SELECT_REQUIRED = [].concat(filterableMultiSelectApi.tokens, specTokens(filterableMultiSelectSpec));
const SELECT_ITEM_REQUIRED = [].concat(selectItemApi.tokens, specTokens(selectItemSpec));
const SELECT_ITEM_GROUP_REQUIRED = [].concat(selectItemGroupApi.tokens, specTokens(selectItemGroupSpec));
const COMBO_BOX_REQUIRED = [].concat(comboBoxApi.tokens, specTokens(comboBoxSpec));
const FAB_REQUIRED = [].concat(fabApi.tokens, specTokens(fabSpec));

// The hue cells a Tag `type` reads on demand - the variants' hover, border
// and glyph cells ride the same on-demand rule
const TAG_SUPPORTED = [].concat(tagApi.colors, dismissibleTagApi.colors, operationalTagApi.colors).map(function (leaf) {
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


export const REQUIRED_TOKENS = join(CONTEXT_TOKENS, ICON_REQUIRED, TEXT_REQUIRED, BUTTON_REQUIRED, CHECKBOX_REQUIRED, TEXT_INPUT_REQUIRED, TEXT_AREA_REQUIRED, SELECT_REQUIRED, DROPDOWN_REQUIRED, TAG_REQUIRED, PROGRESS_BAR_REQUIRED, RADIO_BUTTON_REQUIRED, TOGGLE_REQUIRED, TOOLTIP_REQUIRED, ICON_BUTTON_REQUIRED, TABS_REQUIRED, TAB_REQUIRED, TAB_LIST_REQUIRED, TAB_PANEL_REQUIRED, TAB_PANELS_REQUIRED, ICON_TAB_REQUIRED, TABS_VERTICAL_REQUIRED, TAB_LIST_VERTICAL_REQUIRED, TABS_SKELETON_REQUIRED, CONTENT_SWITCHER_REQUIRED, SWITCH_REQUIRED, ICON_SWITCH_REQUIRED, MENU_REQUIRED, MODAL_REQUIRED, TOAST_NOTIFICATION_REQUIRED, ASPECT_RATIO_REQUIRED, DIVIDER_REQUIRED, ICON_SKELETON_REQUIRED, LINK_REQUIRED, SKELETON_ICON_REQUIRED, SKELETON_PLACEHOLDER_REQUIRED, SKELETON_TEXT_REQUIRED, BUTTON_SET_REQUIRED, BUTTON_SKELETON_REQUIRED, COMBO_BUTTON_REQUIRED, DANGER_BUTTON_REQUIRED, PRIMARY_BUTTON_REQUIRED, SECONDARY_BUTTON_REQUIRED, DISMISSIBLE_TAG_REQUIRED, OPERATIONAL_TAG_REQUIRED, SELECTABLE_TAG_REQUIRED, TAG_SKELETON_REQUIRED, LOADING_REQUIRED, INLINE_LOADING_REQUIRED, PROGRESS_INDICATOR_REQUIRED, PROGRESS_STEP_REQUIRED, PROGRESS_INDICATOR_SKELETON_REQUIRED, FORM_REQUIRED, FORM_GROUP_REQUIRED, FORM_ITEM_REQUIRED, FORM_LABEL_REQUIRED, HEADING_REQUIRED, SECTION_REQUIRED, HSTACK_REQUIRED, STACK_REQUIRED, VSTACK_REQUIRED, TOGGLE_SKELETON_REQUIRED, LAYER_REQUIRED, PASSWORD_INPUT_REQUIRED, TEXT_INPUT_SKELETON_REQUIRED, TEXT_AREA_SKELETON_REQUIRED, TIME_PICKER_REQUIRED, TIME_PICKER_SELECT_REQUIRED, NUMBER_INPUT_REQUIRED, NUMBER_INPUT_SKELETON_REQUIRED, SEARCH_REQUIRED, EXPANDABLE_SEARCH_REQUIRED, SEARCH_SKELETON_REQUIRED, CHECKBOX_SKELETON_REQUIRED, RADIO_BUTTON_SKELETON_REQUIRED, CHECKBOX_GROUP_REQUIRED, RADIO_BUTTON_GROUP_REQUIRED, SLIDER_REQUIRED, SLIDER_SKELETON_REQUIRED, SELECT_SKELETON_REQUIRED, DROPDOWN_SKELETON_REQUIRED, MULTI_SELECT_REQUIRED, FILTERABLE_MULTI_SELECT_REQUIRED, SELECT_ITEM_REQUIRED, SELECT_ITEM_GROUP_REQUIRED, COMBO_BOX_REQUIRED, FAB_REQUIRED, POPOVER_REQUIRED, POPOVER_CONTENT_REQUIRED, DEFINITION_TOOLTIP_REQUIRED, TOGGLETIP_REQUIRED, TOGGLETIP_LABEL_REQUIRED, TOGGLETIP_BUTTON_REQUIRED, TOGGLETIP_CONTENT_REQUIRED, TOGGLETIP_ACTIONS_REQUIRED, TAG_SET_REQUIRED);

export const SUPPORTED_TOKENS = join(REQUIRED_TOKENS, ICON_SUPPORTED, TEXT_SUPPORTED, VIEW_SUPPORTED, FIELD_SURFACES, TAG_SUPPORTED);

export const REQUIRED_ICONS = Object.freeze(['checked_indicator', 'mixed_indicator', 'invalid', 'dropdown_indicator', 'checkmark_filled', 'error_filled', 'switch_checked_indicator', 'selected_indicator', 'close', 'information_filled', 'info', 'warning_filled', 'chevron_down', 'warning', 'incomplete', 'checkmark_outline', 'circle_dash', 'search', 'subtract', 'add', 'visibility_on', 'visibility_off']);
