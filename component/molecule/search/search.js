// Info: Search molecule. A `search` landmark holding the field anatomy's
// frame - leading magnifier, input, clear action - with no visible label:
// the label props name the control through its accessible name, as the
// primary's own search label is visually hidden. One action slot is
// reserved on each side of the text whether or not the clear shows; the
// clear mounts hidden and untabbable while the field is empty. Escape
// clears a populated field, or asks an expandable owner to collapse an
// empty one.
//
// Behavior: `useTextField` owns text, focus and hover; `getSearchHandlers`
// owns the clear and keyboard contract; `useButton` owns the clear's and
// the collapsed trigger's press state. `useReducedMotion` stills the
// expandable width transition.
//
// Composition props - `expanded`, `onExpand`, `onCollapseRequest`,
// `inputRef`, `triggerRef`, `leadingIconColor`,
// `leadingIconDisabledColor` - exist for ExpandableSearch alone.

import SPEC from './spec.js';
import createFieldParts from '../text-input/field-parts.js';


/********************************************************************
Search factory.

@param {Object} ctx - Component context

@return {Function} - The Search component
*********************************************************************/
export default function Search (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useTextField, useButton, getSearchHandlers, useReducedMotion } = ctx.behaviors;
  const { renderField, FieldAction, actionGeometry } = createFieldParts(ctx);

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });

  // The clear's palette: the field action's container cells
  const PALETTE = Object.freeze({
    '': null,
    _active: 'field_action_container_active',
    _disabled: null,
    _focus: null,
    _hover: 'field_action_container_hover',
    _selected: null
  });

  // The collapsed trigger's palette: its own hover rule, not the field's
  const COLLAPSED_PALETTE = Object.freeze({
    '': null,
    _active: 'background_hover',
    _disabled: null,
    _focus: null,
    _hover: 'background_hover',
    _selected: null
  });


  /********************************************************************
  Search component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function SearchComponent (props) {

    // Init the behaviors and their state. The field never owns a visible
    // label: `label`/`accessibilityLabel` name the input directly, so no
    // dangling aria-labelledby is emitted
    const ownInputRef = React.useRef(null);
    const ownTriggerRef = React.useRef(null);
    const inputRef = props.inputRef || ownInputRef;
    const triggerRef = props.triggerRef || ownTriggerRef;
    const escapeCollapse = React.useRef(false);
    const expandable = props.onExpand !== undefined || props.onCollapseRequest !== undefined;
    const expanded = expandable ? props.expanded === true : true;
    const populatedRef = React.useRef('');
    // The label props resolve to the control's one accessible name, as the
    // primary's visually hidden search label does
    const name = Utils.isString(props.label) ? props.label
      : Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : 'Search';
    const fieldProps = Object.assign({}, props, {
      accessibilityLabel: name,
      label: undefined,
      // The empty field's default hint; an explicit empty string stays empty
      placeholder: Utils.isString(props.placeholder) ? props.placeholder : 'Search',
      onBlur: function (event) {
        // A populated blur keeps an expandable field open; an empty one
        // asks its owner to collapse
        if (typeof props.onBlur === 'function') {
          props.onBlur(event);
        }
        if (expandable && expanded && Utils.isEmptyString(populatedRef.current)
          && typeof props.onCollapseRequest === 'function') {
          props.onCollapseRequest();
        }
      }
    });
    const field = useTextField(fieldProps);
    const state = field.state;
    populatedRef.current = state.value;
    const handlers = getSearchHandlers({
      populated: state.populated,
      disabled: state.disabled,
      onChangeText: field.inputProps.onChangeText,
      onClear: props.onClear,
      onCollapseRequest: function () {
        escapeCollapse.current = true;
        if (typeof props.onCollapseRequest === 'function') {
          props.onCollapseRequest();
        }
      },
      onSubmit: props.onSubmit,
      value: state.value,
      inputRef: inputRef
    });
    const clear = useButton({
      accessibilityLabel: 'Clear search input',
      disabled: state.disabled,
      onPress: handlers.clear
    });
    const trigger = useButton({
      accessibilityLabel: name,
      disabled: state.disabled,
      onPress: typeof props.onExpand === 'function' ? props.onExpand : undefined
    });
    const reduced = useReducedMotion().state.reducedMotion;

    // After an Escape collapse the trigger is mounted fresh; return focus
    // to it once, then clear the flag so a blur collapse leaves focus alone
    React.useEffect(function () {
      if (expandable && !expanded && escapeCollapse.current === true) {
        escapeCollapse.current = false;
        if (triggerRef.current !== null && typeof triggerRef.current.focus === 'function') {
          triggerRef.current.focus();
        }
      }
    }, [expandable, expanded, triggerRef]);

    // Read the geometry and the theme's field presentation
    const height = ctx.metric('Search', SIZES[props.size] || 'height');
    const geometry = actionGeometry('Search', height);
    const surface = Utils.isString(props.surface) ? props.surface
      : Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background';
    const presentation = ctx.fieldPresentation({
      disabled: state.disabled,
      focused: state.focused,
      hovered: state.hovered,
      invalid: false,
      populated: state.populated
    }, {
      member: 'text_input',
      height: height,
      outlineDisabled: 'search_outline_disabled',
      radius: ctx.metric('Search', 'radius'),
      surface: surface,
      trailing: true
    });

    // The expandable transition: the root widens from the collapsed
    // trigger's square to the full field under the theme's fast motion;
    // reduced motion mounts the field without it
    const transition = expandable && !reduced ? {
      transitionDuration: ctx.token('motion.duration_fast_02') + 'ms',
      transitionProperty: 'width, opacity',
      transitionTimingFunction: 'cubic-bezier(' + ctx.token('motion.easing_standard_productive').join(', ') + ')'
    } : {};

    // The collapsed branch: a field-height magnifier action in its compact
    // tooltip - no input, no frame paint
    if (expandable && !expanded) {
      return React.createElement(View, {
        accessibilityLabel: name,
        role: 'search',
        style: [{ alignSelf: 'flex-start', height: height, position: 'relative', width: height }, transition],
        testID: props.testID
      },
      React.createElement(ctx.Registry.Tooltip, {
        align: 'top',
        compact: true,
        label: name
      }, React.createElement(FieldAction, {
        button: trigger,
        buttonRef: triggerRef,
        geometry: geometry,
        height: height,
        icon: 'search',
        iconColor: state.disabled
          ? (Utils.isString(props.leadingIconDisabledColor) ? props.leadingIconDisabledColor : 'search_icon_disabled')
          : 'field_indicator',
        palette: COLLAPSED_PALETTE,
        testID: 'search-expand'
      })));
    }

    // The leading magnifier, centered in the leading slot, decorative
    const leading = React.createElement(View, {
      'aria-hidden': true,
      key: 'leading',
      pointerEvents: 'none',
      testID: 'search-leading-icon',
      style: {
        height: geometry.iconSize,
        position: 'absolute',
        start: geometry.glyphInset,
        top: (height - geometry.iconSize) / 2,
        width: geometry.iconSize
      }
    }, React.createElement(ctx.Registry.Icon, {
      name: 'search',
      size: geometry.iconSize,
      color: state.disabled
        ? (Utils.isString(props.leadingIconDisabledColor) ? props.leadingIconDisabledColor : 'search_icon_disabled')
        : (Utils.isString(props.leadingIconColor) ? props.leadingIconColor : 'field_leading_icon')
    }));

    // The clear, hidden and untabbable while the field is empty
    const clearAction = React.createElement(FieldAction, {
      button: clear,
      key: 'clear',
      edgeWidth: ctx.enum('anatomy.field_action') === 'square' ? ctx.metric('Search', 'edgeWidth') : 0,
      geometry: geometry,
      height: height,
      hidden: !state.populated,
      icon: 'close',
      iconColor: state.disabled ? 'search_icon_disabled' : 'field_indicator',
      palette: PALETTE,
      testID: 'search-clear'
    });

    // One action slot is reserved on each side of the text, clear or not
    const reserve = geometry.slotWidth - presentation.borderSide;

    return React.createElement(View, {
      accessibilityLabel: name,
      role: 'search',
      style: [{ alignSelf: 'stretch', position: 'relative' }, transition]
    }, renderField({
      owner: 'Search',
      props: fieldProps,
      field: field,
      presentation: presentation,
      frameStyle: { paddingEnd: reserve, paddingStart: reserve },
      // The labelless field reserves no floating-label room; the parent
      // owns the landmark's zero top padding
      rootStyle: { paddingTop: 0 },
      inputProps: {
        onKeyPress: handlers.onKeyPress,
        onSubmitEditing: handlers.onSubmitEditing,
        role: 'searchbox'
      },
      inputRef: inputRef,
      placeholderColor: state.disabled ? ctx.color('search_placeholder_disabled') : undefined,
      renderLabel: false,
      renderMessage: false,
      overlays: [leading, clearAction]
    }));

  }

  SearchComponent.displayName = 'Search';

  return SearchComponent;

}

Search.spec = SPEC;
