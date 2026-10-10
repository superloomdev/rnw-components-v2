// Info: RadioButton molecule. A pressable row holding the ring and the
// label. The ring is a circle drawn from the radio geometry cells; the
// checked state draws a centered dot inside it - drawn, not composed, so
// the family needs no icon. A press or Space checks the radio and a radio
// never unchecks itself; mutual exclusion belongs to the group. The theme's
// `selection` role cells supply outline, fill, label, layer and focus
// colors; the `radio` cells supply the ring and dot geometry, the focus
// offset and the selected ring color.

import SPEC from './spec.js';


/********************************************************************
RadioButton factory.

@param {Object} ctx - Component context

@return {Function} - The RadioButton component
*********************************************************************/
export default function RadioButton (ctx) {

  const React = ctx.React;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useControllableState, useInteractionState, getA11yState, getA11yRelation, useA11yId } = ctx.behaviors;


  /********************************************************************
  RadioButton component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function RadioButtonComponent (props) {

    // Init the state: checked is controllable, the rest is interaction
    const disabled = props.disabled === true;
    const invalid = props.invalid === true && !disabled;
    const [checked, setChecked] = useControllableState({ value: props.checked, defaultValue: false, onChange: props.onChange });
    const selected = checked === true;

    // A press checks the radio; a checked radio ignores it
    const select = function () {
      if (checked !== true) {
        setChecked(true);
      }
    };
    const interaction = useInteractionState({ disabled: disabled, onPress: select });
    const state = interaction.state;

    // Read the geometry through the spec sheet
    const ringSize = ctx.metric('RadioButton', 'ringSize');
    const layerSize = ctx.metric('RadioButton', 'layerSize');
    const dotSize = ctx.metric('RadioButton', 'dotSize');
    const layerOffset = (ringSize - layerSize) / 2;
    const dotOffset = (ringSize - dotSize) / 2;
    const radius = ctx.metric('RadioButton', 'radius');

    // The state in effect: disabled, then invalid, then pressed, then hovered, then focused
    const phase = state.disabled ? '_disabled' : invalid ? '_invalid' : state.pressed ? '_active' : state.hovered ? '_hover' : state.focused ? '_focus' : '';
    const selectedEdge = 'radio_outline_selected' + phase;
    const edge = state.disabled ? 'selection_outline_disabled' : invalid ? 'selection_outline_invalid' : selected ? selectedEdge : 'selection_outline' + phase;
    const dot = state.disabled ? 'selection_container_disabled' : 'selection_container' + phase;

    // The state layer: the theme's translucent disc for the selection and the state, shown while hovered or pressed
    const live = !state.disabled && (state.pressed || state.hovered);
    const layerLeaf = 'selection_layer_' + (selected ? 'selected_' : '') + (state.pressed ? 'active' : 'hover');

    // The focus ring is an outline on the ring itself: its own border radius
    // makes the outline round, and the radio cells set the offset
    const ring = ctx.focusRing('selection', { focused: state.focused && !state.pressed, focusVisible: state.focusVisible });
    const ringStyle = Object.assign({}, ring, { outlineOffset: ctx.metric('RadioButton', 'focusOffset') });

    // Render the row: the ring box with its layer and dot, then the label
    const labelId = useA11yId('radio');
    return React.createElement(Pressable, Object.assign({}, interaction.rootProps, getA11yState({ checked: selected, disabled: disabled || undefined, invalid: invalid || undefined }), getA11yRelation({ labelledby: labelId }), {
      accessibilityRole: 'radio',
      disabled: disabled,
      // Pressable owns the tab order and honors tabIndex only, so the group's
      // roving answer arrives as tabIndex, not the `focusable` prop
      tabIndex: props.focusable === false ? -1 : undefined,
      onKeyDown: function (event) {
        // The web press responder activates a radio on Enter only; the radio
        // pattern checks on Space, so Space is handled here
        if (disabled || event.key !== ' ') {
          return;
        }
        event.preventDefault();
        select();
      },
      testID: props.testID,
      // The focus ring is drawn on the ring, so the row itself shows none
      style: { alignItems: 'center', flexDirection: 'row', outlineStyle: 'none' }
    }),
    React.createElement(View, {
      style: {
        flexShrink: 0,
        height: ringSize,
        marginBottom: ctx.metric('RadioButton', 'ringInsetBottom'),
        marginEnd: ctx.metric('RadioButton', 'labelGap'),
        marginStart: ctx.metric('RadioButton', 'ringInsetStart'),
        marginTop: ctx.metric('RadioButton', 'ringInsetTop'),
        width: ringSize
      }
    },
    React.createElement(View, Object.assign({
      style: [{
        borderColor: ctx.color(edge),
        borderRadius: radius,
        borderWidth: ctx.metric('RadioButton', 'borderWidth'),
        height: ringSize,
        width: ringSize
      }, ringStyle]
    })),
    // The state layer lies over the ring and under the dot
    React.createElement(View, {
      style: [{
        borderRadius: ctx.metric('RadioButton', 'layerRadius'),
        height: layerSize,
        left: layerOffset,
        pointerEvents: 'none',
        position: 'absolute',
        top: layerOffset,
        width: layerSize
      }, { backgroundColor: ctx.color(layerLeaf), opacity: live ? 1 : 0 }]
    }),
    React.createElement(View, {
      style: {
        backgroundColor: ctx.color(dot),
        borderRadius: radius,
        display: selected ? 'flex' : 'none',
        height: dotSize,
        left: dotOffset,
        pointerEvents: 'none',
        position: 'absolute',
        top: dotOffset,
        width: dotSize
      }
    })),
    React.createElement(Text, {
      nativeID: labelId,
      style: [ctx.typeStyle('body_compact_01'), {
        alignSelf: 'flex-start',
        color: ctx.color(state.disabled ? 'selection_label_disabled' : 'selection_label'),
        // The label grows from its own width, not from zero: native layout
        // gives `flex: 1` a zero basis, which collapses it inside a row that
        // sizes to its content
        flexBasis: 'auto',
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 0
      }]
    }, props.label));

  }

  RadioButtonComponent.displayName = 'RadioButton';

  return RadioButtonComponent;

}

RadioButton.spec = SPEC;
