// Info: Checkbox molecule. A pressable row holding the box (with its mark,
// an Icon) and the label, plus a helper or error message below; composes
// the `useCheckbox` behavior for checked, mixed, press, hover, focus and
// disabled, and draws the theme's `selection` role cells: the box outline
// or fill and the mark per state, a state layer disc centred on the box,
// and a focus ring drawn around the box at the theme's offset and corner.

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

    // The state in effect: disabled, then invalid, then pressed, then hovered, then focused
    const phase = state.disabled ? '_disabled' : invalid ? '_invalid' : state.pressed ? '_active' : state.hovered ? '_hover' : state.focused ? '_focus' : '';
    const fill = 'selection_container' + phase;
    const edge = marked ? fill : 'selection_outline' + phase;

    // The state layer: the theme's translucent layer for the selection and the state, shown while hovered or pressed
    const live = !state.disabled && (state.pressed || state.hovered);
    const layerLeaf = 'selection_layer_' + (marked ? 'selected_' : '') + (state.pressed ? 'active' : 'hover');

    // The focus ring around the box, at the theme's offset, width and corner; a
    // checkbox takes focus when a press completes, so no ring shows while it is held
    const ring = ctx.focusRing('selection', { focused: state.focused && !state.pressed, focusVisible: state.focusVisible });
    const ringOffset = Utils.isNumber(ring.outlineOffset) ? ring.outlineOffset : 0;
    const ringStyle = Object.assign({}, ring, {
      borderRadius: ctx.metric('Checkbox', 'focusRadius'),
      height: boxSize + 2 * ringOffset,
      left: -ringOffset,
      outlineOffset: 0,
      pointerEvents: 'none',
      position: 'absolute',
      top: -ringOffset,
      width: boxSize + 2 * ringOffset
    });

    // Render the mark: the check, the mixed dash, or nothing
    const mark = marked ? React.createElement(ctx.Registry.Icon, {
      name: state.indeterminate ? 'mixed_indicator' : 'checked_indicator',
      size: ctx.metric('Checkbox', 'markSize'),
      color: state.disabled ? 'selection_mark_disabled' : 'selection_mark'
    }) : null;

    // Render the message below: the error icon and text while invalid, else the helper
    const message = invalid && Utils.isString(props.invalidText) ? { text: props.invalidText, color: 'selection_message_invalid', invalid: true }
      : Utils.isString(props.helperText) ? { text: props.helperText, color: 'selection_helper', invalid: false } : null;

    // Render the root, the row, the box with its state layer, the label and the message
    return React.createElement(View, null,
      React.createElement(Pressable, Object.assign({}, checkbox.rootProps, getA11yState({ invalid: invalid ? true : undefined }), {
        testID: props.testID,
        // The focus ring is drawn on the box, so the row itself shows none
        style: { alignItems: 'center', flexDirection: 'row', minHeight: ctx.metric('Checkbox', 'minHeight'), outlineStyle: 'none' }
      }),
      React.createElement(View, {
        style: { alignSelf: 'flex-start', height: boxSize, marginStart: ctx.metric('Checkbox', 'boxInsetStart'), marginTop: ctx.metric('Checkbox', 'boxInsetTop'), width: boxSize }
      },
      React.createElement(View, {
        style: {
          backgroundColor: marked ? ctx.color(fill) : 'transparent',
          borderColor: ctx.color(edge),
          borderRadius: ctx.metric('Checkbox', 'radius'),
          // A filled box draws no border; an invalid one keeps its error edge
          borderWidth: marked && !invalid ? 0 : ctx.metric('Checkbox', 'borderWidth'),
          height: boxSize,
          width: boxSize
        }
      }),
      // The state layer lies over the box's fill and under its mark
      React.createElement(View, {
        style: [{
          borderRadius: ctx.metric('Checkbox', 'layerRadius'),
          height: layerSize,
          left: layerOffset,
          position: 'absolute',
          top: layerOffset,
          width: layerSize
        }, { backgroundColor: ctx.color(layerLeaf), opacity: live ? 1 : 0, pointerEvents: 'none' }]
      }),
      React.createElement(View, { style: ringStyle }),
      React.createElement(View, {
        style: { alignItems: 'center', height: boxSize, justifyContent: 'center', left: 0, pointerEvents: 'none', position: 'absolute', top: 0, width: boxSize }
      }, mark)
      ),
      React.createElement(Text, Object.assign({}, checkbox.labelProps, {
        style: [ctx.typeStyle('body_compact_01'), {
          color: ctx.color(state.disabled ? 'selection_label_disabled' : 'selection_label'),
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
      }, React.createElement(ctx.Registry.Icon, { name: 'invalid', size: ctx.metric('Checkbox', 'iconSize'), color: 'selection_invalid_icon' })) : null,
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
