// Info: NumberInput molecule. The shared field anatomy - label, frame
// (input, invalid icon), message - plus two trailing steppers (decrement,
// then increment) over a pair of rule dividers. The numeric text keeps the
// user's editing verbatim while the steppers and arrows move a bounded
// number, per `useNumberInput`. This library follows the declared `step`
// for both the buttons and the arrows; the primary's manual zero shortcut
// steps by one regardless of `step` (source `NumberInput.handleStep`) - a
// deliberate consistency choice, recorded in the family's notes.
//
// Behavior: `useNumberInput` owns the raw text, the bounded stepping and
// both action states; `useTextField` renders its raw string controlled and
// owns focus, hover and the label relation.

import SPEC from './spec.js';
import createFieldParts from '../text-input/field-parts.js';


/********************************************************************
NumberInput factory.

@param {Object} ctx - Component context

@return {Function} - The NumberInput component
*********************************************************************/
export default function NumberInput (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useTextField, useNumberInput, getA11yValue } = ctx.behaviors;
  const { renderField, FieldAction, actionGeometry } = createFieldParts(ctx);

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });

  // The steppers' palette: the member's own action cells - its pressed
  // state keeps the hover fill, as the upstream stylesheet paints it
  const PALETTE = Object.freeze({
    '': null,
    _active: 'number_input_action_container_active',
    _disabled: null,
    _focus: null,
    _hover: 'field_action_container_hover',
    _selected: null
  });


  /********************************************************************
  NumberInput component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function NumberInputComponent (props) {

    // Init the numeric behavior first: it owns the raw text the field
    // behavior then renders controlled, and both action states
    const number = useNumberInput(props);
    const numberState = number.state;
    const field = useTextField(Object.assign({}, props, {
      value: numberState.value,
      onChangeText: number.setText,
      invalid: numberState.invalid
    }));
    const state = field.state;
    const invalid = numberState.invalid && !state.disabled;

    // Read the geometry and the theme's field presentation
    const height = ctx.metric('NumberInput', SIZES[props.size] || 'height');
    const geometry = actionGeometry('NumberInput', height);
    const gap = ctx.metric('NumberInput', 'reserveGap');
    const surface = Utils.isString(props.surface) ? props.surface
      : Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background';
    const presentation = ctx.fieldPresentation({
      disabled: state.disabled,
      focused: state.focused,
      hovered: state.hovered,
      invalid: invalid,
      populated: state.populated
    }, {
      member: 'text_input',
      height: height,
      radius: ctx.metric('NumberInput', 'radius'),
      surface: surface,
      trailing: true
    });

    // The frame's end padding is the two slots plus the text-to-steppers
    // gap in from the outer edge - or, without steppers, the icon's inset
    // while invalid and nothing at all at rest, as the primary lays it out
    const hideSteppers = props.hideSteppers === true;
    const reserve = hideSteppers
      ? (invalid ? gap : 0)
      : geometry.slotWidth * 2 + gap - presentation.borderSide;

    // A focused or invalid field lines its steppers' top and bottom edges;
    // at rest a hovered stepper paints an inset bottom line instead
    const square = ctx.enum('anatomy.field_action') === 'square';
    const edgeWidth = square && !state.disabled && state.focused ? ctx.token('control.field_focus_width')
      : square && invalid ? ctx.token('control.field_invalid_ring_width') : 0;
    const edgeColor = state.focused && !state.disabled ? 'field_focus_ring' : 'field_ring_invalid';
    const edge = edgeWidth === 0 ? undefined : {
      borderBottomColor: ctx.color(edgeColor),
      borderBottomWidth: edgeWidth,
      borderTopColor: ctx.color(edgeColor),
      borderTopWidth: edgeWidth
    };
    const hoverRule = !state.disabled && !state.focused && !invalid
      ? { color: ctx.color('field_outline'), width: ctx.metric('NumberInput', 'ruleWidth') }
      : undefined;
    const iconColor = state.disabled ? 'field_indicator_disabled' : 'field_indicator';

    // The two rule dividers: the start line shows only while invalid; the
    // center line shows unless a stepper is hovered or focused - a
    // decrement interaction hides both, an increment one hides the center
    const decrement = number.actions.decrement;
    const increment = number.actions.increment;
    const downLive = decrement.state.hovered === true || decrement.state.focused === true;
    const upLive = increment.state.hovered === true || increment.state.focused === true;
    const dividerHeight = ctx.metric('NumberInput', 'dividerHeight');
    const dividerWidth = ctx.metric('NumberInput', 'dividerWidth');
    const divider = function (name, start, shown) {
      return React.createElement(View, {
        'aria-hidden': true,
        key: name,
        testID: 'number-divider-' + name,
        style: {
          backgroundColor: shown ? ctx.color(state.disabled ? 'field_indicator_disabled' : 'number_input_divider') : 'transparent',
          height: dividerHeight,
          position: 'absolute',
          start: start,
          top: (height - dividerHeight) / 2,
          width: dividerWidth
        }
      });
    };

    // The stepper group over the frame's end edge: two faces wide
    const steppers = hideSteppers ? null : React.createElement(View, {
      style: {
        bottom: 0,
        end: 0,
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        width: geometry.slotWidth * 2
      }
    },
    React.createElement(FieldAction, {
      button: decrement,
      edgeStyle: edge,
      geometry: geometry,
      height: height,
      hoverRule: hoverRule,
      icon: 'subtract',
      iconColor: iconColor,
      palette: PALETTE,
      seated: false,
      tabIndex: -1,
      targetExpansion: 'start',
      testID: 'number-decrement'
    }),
    React.createElement(FieldAction, {
      button: increment,
      edgeStyle: edge,
      geometry: geometry,
      height: height,
      hoverRule: hoverRule,
      icon: 'add',
      iconColor: iconColor,
      palette: PALETTE,
      seated: false,
      tabIndex: -1,
      targetExpansion: 'end',
      testID: 'number-increment'
    }),
    divider('start', 0, invalid && !state.disabled && !downLive),
    divider('center', geometry.slotWidth - dividerWidth / 2, !downLive && !upLive));

    return renderField({
      owner: 'NumberInput',
      props: props,
      field: field,
      presentation: presentation,
      frameStyle: { paddingEnd: reserve },
      iconGap: invalid ? gap : undefined,
      inputProps: Object.assign({
        accessibilityRole: 'spinbutton',
        inputMode: 'decimal',
        onKeyPress: number.onKeyPress
      }, getA11yValue({
        max: Utils.isNumber(props.max) ? props.max : undefined,
        min: Utils.isNumber(props.min) ? props.min : undefined,
        now: numberState.number
      })),
      rootStyle: { minWidth: ctx.metric('NumberInput', 'minWidth') },
      overlays: steppers
    });

  }

  NumberInputComponent.displayName = 'NumberInput';

  return NumberInputComponent;

}

NumberInput.spec = SPEC;
