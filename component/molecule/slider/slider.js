// Info: Slider molecule. A label above a row of minimum bound, track host,
// maximum bound and an optional number field; the track carries the
// inactive bar, center tick, filled portion, the thumb's state layers and
// focus answer, and the handle face, with the transparent semantic thumb
// over it. With `hideTextInput` the field is replaced by a compact Tooltip
// seated on the thumb. A pointer gesture anywhere on the track repositions
// through the behavior's responder contract, keys and the assistive
// increment/decrement actions step the same value, and the field keeps a
// raw text draft that commits on blur or Enter.
//
// Behavior: `useSlider` owns the bounded value on its min-anchored step
// grid, the raw draft, the responder gesture over the measured host and
// the thumb's interaction state; `useTextField` renders the draft in the
// optional member field. This component owns the theme's geometry, paint
// and naming: shared track paint lives in `slider-parts.js`, the field's
// frame and icon in the shared field parts.
//
// Accessibility: the thumb is the `slider` role with the value triplet,
// increment/decrement actions and the label or `accessibilityLabel` name;
// the member input is a `spinbutton` named by `inputLabel` or the label.
// The invalid message describes both. A disabled thumb leaves the tab
// order. Painted nodes are `aria-hidden` and pointer-transparent.

import SPEC from './spec.js';
import createFieldParts from '../text-input/field-parts.js';
import createSliderParts from './slider-parts.js';


/********************************************************************
Slider factory.

@param {Object} ctx - Component context

@return {Function} - The Slider component
*********************************************************************/
export default function Slider (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useSlider, useTextField, getA11yValue, useA11yId } = ctx.behaviors;
  const { renderField } = createFieldParts(ctx);
  const parts = createSliderParts(ctx);


  /********************************************************************
  Slider component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function SliderComponent (props) {

    // Resolve the prop contract first; the behavior validates the numbers
    const min = Utils.isNumber(props.min) ? props.min : 0;
    const max = Utils.isNumber(props.max) ? props.max : 100;
    const disabled = props.disabled === true;
    const hideLabel = props.hideLabel === true;
    const hideInput = props.hideTextInput === true;
    const labelled = Utils.isString(props.label) && !Utils.isEmptyString(props.label);
    const visibleLabel = labelled && !hideLabel;
    const hiddenName = Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel
      : labelled ? props.label : undefined;
    const inputName = Utils.isString(props.inputLabel) ? props.inputLabel
      : labelled ? props.label : hiddenName;

    const handleInset = ctx.metric('Slider', 'handleInset');
    const height = ctx.metric('Slider', 'height');
    const minWidth = ctx.metric('Slider', 'minWidth');
    const maxWidth = ctx.metric('Slider', 'maxWidth');
    const gap = ctx.metric('Slider', 'gap');
    const baseSize = ctx.metric('Slider', 'handleSize');
    const inputWidth = ctx.metric('Slider', 'inputWidth');
    const inputWidthInvalid = ctx.metric('Slider', 'inputWidthInvalid');
    const inputDisabledBorder = ctx.metric('Slider', 'inputDisabledBorderWidth');

    // The behavior owns value, draft, gesture and interaction state; the
    // handle's pointer travel is inset by the same cells that seat it
    const slider = useSlider({
      min: props.min,
      max: props.max,
      step: props.step,
      value: props.value,
      defaultValue: props.defaultValue,
      onChange: props.onChange,
      onRelease: props.onRelease,
      disabled: props.disabled,
      invalid: props.invalid,
      stepMultiplier: props.stepMultiplier,
      travelInset: handleInset
    });
    const state = slider.state;
    const invalid = state.invalid === true;

    // The member field renders the same draft, controlled; its hooks mount
    // whether or not the field is drawn, so the tree never reshapes
    const field = useTextField({
      disabled: disabled,
      invalid: invalid,
      onBlur: function () {
        slider.commitText();
      },
      onChangeText: slider.setText,
      value: state.text
    });
    const inputHeight = ctx.metric('Slider', 'inputHeight');
    const presentation = ctx.fieldPresentation({
      disabled: disabled,
      focused: field.state.focused,
      hovered: field.state.hovered,
      invalid: invalid,
      populated: field.state.populated
    }, {
      member: 'text_input',
      height: inputHeight,
      radius: ctx.metric('Slider', 'inputRadius'),
      surface: Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background'
    });

    // Bound and tooltip text run through the one formatter; a suffix is
    // only ever the bound's own minLabel/maxLabel
    const formatLabel = Utils.isFunction(props.formatLabel) ? props.formatLabel
      : function (value, suffix) {
        return String(value) + (suffix === undefined ? '' : suffix);
      };
    const formatted = function (value, suffix) {
      const out = formatLabel(value, suffix);
      if (!Utils.isString(out)) {
        throw new TypeError('Slider: formatLabel must return a string');
      }
      return out;
    };

    // Live host width for the paint math; the behavior's onLayout updates
    // it, the min width stands in until the first layout lands
    const hostWidth = state.trackWidth > 0 ? state.trackWidth : minWidth;
    const handleCenter = handleInset + Math.max(0, hostWidth - 2 * handleInset) * state.ratio;

    const labelId = useA11yId('slider-label');
    const messageId = useA11yId('slider-message');
    const message = invalid && Utils.isString(props.invalidText) ? props.invalidText : null;

    // Track host: the responder contract attaches here, the paint is one
    // group plus the tick, and the semantic thumb is its sibling
    const paint = parts.trackPaint('Slider', {
      prefix: 'slider',
      hostWidth: hostWidth,
      layers: true,
      ratio: state.ratio,
      state: {
        disabled: disabled,
        focused: state.focused,
        focusVisible: state.focusVisible,
        hovered: state.hovered,
        pressed: state.pressed
      }
    });

    const thumb = React.createElement(Pressable, Object.assign({}, slider.thumbProps, {
      'aria-describedby': message === null ? undefined : messageId,
      'aria-label': visibleLabel ? undefined : hiddenName,
      'aria-labelledby': visibleLabel ? labelId : undefined,
      // Pressable writes aria-disabled from its own prop - a spread one is
      // replaced - and the spoken text is the formatted value, not the raw
      // number
      'aria-valuetext': formatted(state.value),
      disabled: disabled,
      testID: 'slider-thumb',
      style: ctx.pressTarget({ height: baseSize, width: baseSize })
    }));

    // Without the field the thumb carries a compact tooltip naming the
    // formatted value; the tooltip's measured anchor is the in-flow
    // base-sized box, not a zero-size absolute child
    const anchor = !hideInput ? thumb : React.createElement(ctx.Registry.Tooltip, {
      compact: true,
      label: formatted(state.value),
      paddingInline: ctx.metric('Slider', 'tooltipPaddingInline')
    }, React.createElement(View, {
      style: { height: baseSize, width: baseSize }
    }, thumb));

    const thumbSlot = React.createElement(View, {
      style: {
        height: baseSize,
        position: 'absolute',
        start: handleCenter - baseSize / 2,
        top: (height - baseSize) / 2,
        width: baseSize
      }
    }, anchor);

    const host = React.createElement(View, Object.assign({}, slider.trackProps, {
      testID: 'slider-track',
      style: {
        flexShrink: 1,
        height: height,
        maxWidth: maxWidth,
        minWidth: minWidth,
        position: 'relative',
        width: minWidth
      }
    }), paint, thumbSlot);

    // The range labels keep the theme's endpoint type and never split a
    // number across lines
    const labelStyle = function (testID, text) {
      return React.createElement(Text, {
        numberOfLines: 1,
        style: [ctx.textPresentation(ctx.typeStyle('slider_range_label')), {
          color: ctx.color(disabled ? 'field_value_disabled' : 'slider_range_label'),
          flexShrink: 0
        }],
        testID: testID
      }, text);
    };

    // The number field: Enter commits the draft, arrows step the same
    // value the thumb's keys would - the member has no stepping of its own
    const onInputKey = function (event) {
      if (Utils.isNullOrUndefined(event)) {
        return;
      }
      const native = event.nativeEvent;
      const key = event.key === undefined
        ? (Utils.isNullOrUndefined(native) ? undefined : native.key)
        : event.key;
      if (key === 'Enter') {
        slider.commitText();
        return;
      }
      slider.thumbProps.onKeyDown({
        key: key,
        preventDefault: !Utils.isFunction(event.preventDefault) ? undefined
          : function () {
            event.preventDefault();
          },
        shiftKey: event.shiftKey === true ||
          (!Utils.isNullOrUndefined(native) && native.shiftKey === true)
      });
    };

    const memberProps = { accessibilityLabel: inputName, testID: 'slider-input' };
    const fieldElement = !hideInput ? renderField({
      owner: 'Slider',
      props: memberProps,
      field: field,
      presentation: presentation,
      renderLabel: false,
      renderMessage: false,
      frameStyle: Object.assign({ width: invalid ? inputWidthInvalid : inputWidth },
        // The disabled override follows the neutral field anatomy: an
        // underline field replaces only its underline, an outline field
        // only its ring - never both sides of one border
        disabled ? (ctx.enum('feedback.field') === 'underline'
          ? { borderBottomWidth: inputDisabledBorder }
          : { borderWidth: inputDisabledBorder }) : null),
      // The unlabeled member keeps none of the floating label's reserve
      rootStyle: { paddingTop: 0 },
      inputProps: Object.assign({
        'aria-describedby': message === null ? undefined : messageId,
        accessibilityRole: 'spinbutton',
        inputMode: 'decimal',
        // NativeTextInput routes every DOM keydown through onKeyPress
        onKeyPress: onInputKey
      }, getA11yValue({ max: max, min: min, now: state.value }))
    }) : null;

    // The label keeps its box under `hideLabel`, clipped out of the flow
    const labelElement = !labelled ? null : React.createElement(Text, {
      nativeID: labelId,
      numberOfLines: 1,
      testID: 'slider-label',
      style: [ctx.typeStyle('field_label'), {
        color: ctx.color(disabled ? 'field_label_disabled' : 'field_label'),
        marginBottom: ctx.metric('Slider', 'labelGap')
      }, !visibleLabel ? {
        height: 1,
        marginBottom: 0,
        overflow: 'hidden',
        position: 'absolute',
        width: 1
      } : null]
    }, props.label);

    const messageElement = message === null ? null : React.createElement(Text, {
      nativeID: messageId,
      testID: 'slider-message',
      style: [ctx.typeStyle('field_helper'), {
        color: ctx.color('field_message_invalid'),
        marginStart: ctx.metric('Slider', 'messageInset'),
        marginTop: ctx.metric('Slider', 'messageGap')
      }]
    }, message);

    return React.createElement(View, {
      style: { alignSelf: 'flex-start', maxWidth: 100 + '%', position: 'relative' },
      testID: props.testID
    },
    labelElement,
    React.createElement(View, {
      style: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: gap,
        maxWidth: 100 + '%'
      },
      testID: 'slider-row'
    },
    labelStyle('slider-minimum', formatted(min, props.minLabel)),
    host,
    labelStyle('slider-maximum', formatted(max, props.maxLabel)),
    fieldElement),
    messageElement);

  }

  SliderComponent.displayName = 'Slider';

  return SliderComponent;

}

Slider.spec = SPEC;
