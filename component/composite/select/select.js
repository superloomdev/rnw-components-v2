// Info: Select composite. A field root holding the label, the frame (a
// pressable trigger showing the selection, an error Icon while invalid and
// the caret Icon) and a helper or error message; while open, the option
// list is laid out below the frame at the dropdown stacking level. Composes
// the `useSelect` behavior for open, selection and keyboard traversal, and
// draws the theme's `feedback.field` frame, `anatomy.label` placement and
// `anatomy.caret` choice.

import SPEC from './spec.js';


/********************************************************************
Select factory.

@param {Object} ctx - Component context

@return {Function} - The Select component
*********************************************************************/
export default function Select (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useSelect, getA11yState } = ctx.behaviors;

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


  /********************************************************************
  Select component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function SelectComponent (props) {

    // Init the behavior and its state
    const select = useSelect(props);
    const state = select.state;
    const items = Utils.isArray(props.items) ? props.items : [];
    const invalid = props.invalid === true && !state.disabled;
    const labelled = Utils.isString(props.label) && !Utils.isEmptyString(props.label);
    const selected = state.selectedIndex >= 0 ? items[state.selectedIndex] : null;

    // Read the geometry and the theme's field presentation
    const height = ctx.metric('Select', SIZES[props.size] || 'height');
    const paddingInline = ctx.metric('Select', 'paddingInline');
    const iconSize = ctx.metric('Select', 'iconSize');
    const iconGap = ctx.metric('Select', 'iconGap');
    const surface = Utils.isString(props.surface) ? props.surface
      : Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background';
    const presentation = ctx.fieldPresentation({
      disabled: state.disabled,
      focused: state.focused || state.open,
      hovered: false,
      invalid: invalid,
      populated: selected !== null
    }, {
      height: height,
      paddingInline: paddingInline,
      radius: ctx.metric('Select', 'radius'),
      surface: surface,
      disabledBorder: null
    });

    // The caret is always mounted; the theme's anatomy.caret decides whether it shows
    const caret = React.createElement(View, {
      style: { display: ctx.enum('anatomy.caret') === 'shown' ? 'flex' : 'none', marginStart: iconGap }
    }, React.createElement(ctx.Registry.Icon, { name: 'chevron_down', size: iconSize, color: state.disabled ? 'icon_disabled' : 'icon_primary' }));

    // Render the error icon while invalid
    const icon = invalid ? React.createElement(View, { style: { marginStart: iconGap } },
      React.createElement(ctx.Registry.Icon, { name: 'warning_filled', size: iconSize, color: 'support_error' })) : null;

    // Render the option list while open
    const list = state.open ? React.createElement(View, Object.assign({}, select.listProps, {
      style: [{
        backgroundColor: ctx.color('layer_01'),
        left: 0,
        position: 'absolute',
        right: 0,
        top: height,
        zIndex: ctx.metric('Select', 'listLevel')
      }, ctx.token('shadow.level_02')]
    }), items.map(function (item, index) {
      const fill = index === state.selectedIndex ? 'layer_selected_01' : index === state.highlightedIndex ? 'layer_hover_01' : 'layer_01';
      return React.createElement(Pressable, Object.assign({ key: item.value }, select.getOptionProps(index), {
        style: {
          backgroundColor: ctx.color(fill),
          height: ctx.metric('Select', 'optionHeight'),
          justifyContent: 'center',
          paddingHorizontal: paddingInline
        }
      }), React.createElement(Text, {
        numberOfLines: 1,
        style: [ctx.typeStyle('body_compact_01'), { color: ctx.color('text_primary') }]
      }, item.label));
    })) : null;

    // Render the message below: the error while invalid, else the helper
    const message = invalid && Utils.isString(props.invalidText) ? { text: props.invalidText, color: 'text_error' }
      : Utils.isString(props.helperText) ? { text: props.helperText, color: 'text_helper' } : null;

    // Size the trigger to its widest text, as a platform select sizes to its
    // widest option, so the frame does not change width with the selection;
    // the sizer takes no height and is hidden from assistive technology
    const bodyStyle = ctx.typeStyle('body_compact_01');
    const placeholder = Utils.isString(props.placeholder) ? props.placeholder : '';
    const sizer = React.createElement(View, { 'aria-hidden': true, style: { height: 0, overflow: 'hidden' } },
      [placeholder].concat(items.map(function (item) {
        return item.label;
      })).map(function (text, index) {
        return React.createElement(Text, { key: index, numberOfLines: 1, style: bodyStyle }, text);
      }));

    // Render the root, the label, the frame with the trigger and the list, and the message
    return React.createElement(View, Object.assign({}, select.rootProps, { style: [{ position: 'relative' }, presentation.root] }),
      labelled ? React.createElement(Text, Object.assign({}, select.labelProps, { style: presentation.label }), props.label) : null,
      React.createElement(View, { style: [presentation.frame, ctx.focusPresentation(state.focused)] },
        React.createElement(Pressable, Object.assign({}, select.triggerProps, getA11yState({ invalid: invalid ? true : undefined }), {
          accessibilityLabel: props.accessibilityLabel,
          testID: props.testID,
          // The focus ring is drawn on the frame, so the trigger itself shows none
          style: { alignItems: 'center', alignSelf: 'stretch', flex: 1, flexDirection: 'row', outlineStyle: 'none' }
        }),
        React.createElement(View, { style: { flexGrow: 1 } },
          React.createElement(Text, {
            numberOfLines: 1,
            style: [bodyStyle, {
              color: ctx.color(state.disabled ? 'text_disabled' : selected === null ? 'text_placeholder' : 'text_primary'),
              // A resting floating label covers the placeholder; it stays in the tree, undrawn
              opacity: selected === null && labelled && !presentation.placeholder ? 0 : 1
            }]
          }, selected === null ? placeholder : selected.label),
          sizer),
        icon,
        caret),
        list
      ),
      message === null ? null : React.createElement(Text, {
        style: [ctx.typeStyle('helper_text_01'), presentation.message, { color: ctx.color(message.color), marginTop: ctx.metric('Select', 'messageGap') }]
      }, message.text)
    );

  }

  SelectComponent.displayName = 'Select';

  return SelectComponent;

}

Select.spec = SPEC;
