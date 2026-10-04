// Info: Checkbox molecule. A pressable row holding the box (with its mark,
// an Icon) and the label, plus a helper or error message below; composes
// the `useCheckbox` behavior for checked, mixed, press, hover, focus and
// disabled, and draws the theme's `feedback.press` choice as a state layer
// disc centered on the box.

import SPEC from './spec.js';


/********************************************************************
Checkbox factory.

@param {Object} ctx - Component context

@return {Function} - The Checkbox component
*********************************************************************/
export default function Checkbox (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useCheckbox, getA11yState } = ctx.behaviors;


  /********************************************************************
  Checkbox component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function CheckboxComponent (props) {

    // Init the behavior and its state
    const checkbox = useCheckbox(props);
    const state = checkbox.state;
    const invalid = props.invalid === true && !state.disabled;
    const marked = state.checked || state.indeterminate;

    // Read the geometry through the spec sheet
    const boxSize = ctx.metric('Checkbox', 'boxSize');
    const layerSize = ctx.metric('Checkbox', 'layerSize');
    const layerOffset = (boxSize - layerSize) / 2;

    // Init the box colors: disabled, then invalid, then rest
    const fill = state.disabled ? 'icon_disabled' : 'control_checked';
    const edge = state.disabled ? 'icon_disabled' : invalid ? 'support_error' : marked ? fill : 'icon_primary';

    // Read the theme's press presentation; the checkbox itself has no fill
    const press = ctx.pressPresentation(state, { rest: null, hover: null, active: null, content: 'icon_primary' });

    // Render the mark: the check, the mixed dash, or nothing
    const mark = marked ? React.createElement(ctx.Registry.Icon, {
      name: state.indeterminate ? 'subtract' : 'checkmark',
      size: ctx.metric('Checkbox', 'markSize'),
      color: 'icon_inverse'
    }) : null;

    // Render the message below: the error icon and text while invalid, else the helper
    const message = invalid && Utils.isString(props.invalidText) ? { text: props.invalidText, color: 'text_error', invalid: true }
      : Utils.isString(props.helperText) ? { text: props.helperText, color: 'text_helper', invalid: false } : null;

    // Render the root, the row, the box with its state layer, the label and the message
    return React.createElement(View, null,
      React.createElement(Pressable, Object.assign({}, checkbox.rootProps, getA11yState({ invalid: invalid ? true : undefined }), {
        testID: props.testID,
        // The focus ring is drawn on the box, so the row itself shows none
        style: [{ alignItems: 'center', flexDirection: 'row', minHeight: ctx.metric('Checkbox', 'minHeight'), outlineStyle: 'none' }, press.container]
      }),
      React.createElement(View, { style: { height: boxSize, width: boxSize } },
        React.createElement(View, {
          style: [{
            borderRadius: ctx.metric('Checkbox', 'layerRadius'),
            height: layerSize,
            left: layerOffset,
            position: 'absolute',
            top: layerOffset,
            width: layerSize
          }, press.layer]
        }),
        React.createElement(View, {
          style: [{
            alignItems: 'center',
            backgroundColor: marked ? ctx.color(fill) : 'transparent',
            borderColor: ctx.color(edge),
            borderRadius: ctx.metric('Checkbox', 'radius'),
            // A filled box draws no border; an invalid one keeps its error edge
            borderWidth: marked && !invalid ? 0 : ctx.metric('Checkbox', 'borderWidth'),
            height: boxSize,
            justifyContent: 'center',
            width: boxSize
          }, ctx.focusPresentation(state.focused)]
        }, mark)
      ),
      React.createElement(Text, Object.assign({}, checkbox.labelProps, {
        style: [ctx.typeStyle('body_compact_01'), {
          color: ctx.color(state.disabled ? 'text_disabled' : 'text_primary'),
          marginStart: ctx.metric('Checkbox', 'labelGap')
        }]
      }), props.label)),
      message === null ? null : React.createElement(View, {
        style: { alignItems: 'flex-start', flexDirection: 'row', marginTop: ctx.metric('Checkbox', 'messageGap') }
      },
      message.invalid ? React.createElement(View, {
        style: {
          marginEnd: ctx.metric('Checkbox', 'iconInsetEnd'),
          marginStart: ctx.metric('Checkbox', 'iconInsetStart'),
          marginTop: ctx.metric('Checkbox', 'iconInsetTop')
        }
      }, React.createElement(ctx.Registry.Icon, { name: 'warning_filled', size: ctx.metric('Checkbox', 'iconSize'), color: 'support_error' })) : null,
      React.createElement(Text, {
        style: [ctx.typeStyle('helper_text_01'), {
          color: ctx.color(message.color),
          marginStart: message.invalid ? ctx.metric('Checkbox', 'messageTextGap') : 0
        }]
      }, message.text))
    );

  }

  CheckboxComponent.displayName = 'Checkbox';

  return CheckboxComponent;

}

Checkbox.spec = SPEC;
