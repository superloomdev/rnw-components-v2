// Info: DatePickerInput composite, one date field of a DatePicker. It
// renders only inside the picker's compound context: the label and field
// of the text-input family at the width the picker's type assigns - the
// single width, the range width (with the one-gap on the first of two),
// the simple width or its message and short answers - with the calendar
// icon at the field icon inset unless the picker is `simple`. The first
// field's frame seats the picker's calendar; under the OS picker the
// host's adapter takes the text input's place in the frame.
//
// Behavior: `useTextField` owns focus, hover and validation; the picker
// context supplies the text, the type, `short`, `isReadOnly`, the seat
// index and the open state: focus or ArrowDown opens the calendar.
// Unparented, the context default draws a single editable field.

import SPEC from './spec.date-picker-input.js';
import createDatePickerContext from './date-picker-context.js';
import createFieldParts from '../../molecule/text-input/field-parts.js';


/********************************************************************
DatePickerInput factory.

@param {Object} ctx - Component context

@return {Function} - The DatePickerInput component
*********************************************************************/
export default function DatePickerInput (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useTextField } = ctx.behaviors;
  const { renderField } = createFieldParts(ctx);
  const DatePickerContext = createDatePickerContext(ctx);

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


  /********************************************************************
  DatePickerInput component.

  @param {Object} props - See `api.date-picker-input.js`

  @return {Object} - React element
  *********************************************************************/
  function DatePickerInputComponent (props) {

    const picker = React.useContext(DatePickerContext);
    const index = Utils.isNumber(props.pickerIndex) ? props.pickerIndex : 0;
    const parented = Utils.isFunction(picker.setText);

    // Init the field behavior on the picker's text for this seat; focus
    // opens the calendar; a disabled field is never invalid
    const field = useTextField(parented ? Object.assign({}, props, {
      disabled: props.disabled === true || picker.disabled === true,
      onChangeText: function (text) {
        picker.setText(index, text);
      },
      onFocus: function (event) {
        picker.setOpen(true);
        if (Utils.isFunction(props.onFocus)) {
          props.onFocus(event);
        }
      },
      value: picker.texts[index]
    }) : props);
    const state = field.state;
    const invalid = state.invalid === true && state.disabled !== true;

    // The picker's type and flags assign the width: simple reads its own
    // cells (message and short answers first), single the picker width,
    // range the range cell - `short` narrows only a simple picker
    const type = picker.type;
    const flags = Utils.isObject(picker.flags) ? picker.flags : {};
    const flagged = props.invalid === true || props.warn === true || invalid === true;
    const widthKey = type === 'simple'
      ? flags.short === true ? 'widthShort' : flagged === true ? 'widthSimpleMessage' : 'widthSimple'
      : type === 'range' ? 'widthRange' : 'width';
    const width = ctx.metric('DatePickerInput', widthKey);

    const height = ctx.metric('DatePickerInput', SIZES[props.size] || 'height');
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
      radius: ctx.metric('DatePickerInput', 'radius'),
      surface: surface,
      trailing: true
    });

    // One icon ends at the frame's icon inset (its end padding): the
    // calendar, drawn disabled on a disabled or read-only field, or the
    // error glyph on an invalid one; a valid `simple` field draws none
    const locked = state.disabled === true || picker['isReadOnly'] === true || props['isReadOnly'] === true;
    const iconName = invalid && !locked ? 'invalid' : 'calendar';
    const iconColor = locked ? 'icon_disabled' : invalid ? presentation.invalidIcon : 'icon_primary';
    const icon = type === 'simple' && !invalid ? null : React.createElement(View, {
      style: { alignSelf: 'center' }
    }, React.createElement(ctx.Registry.Icon, { color: iconColor, name: iconName, size: ctx.metric('DatePickerInput', 'iconSize') }));

    // The first of a range's two pickers carries the one-gap
    const marginEnd = type === 'range' && index === 0 ? 1 : 0;

    // The first field's frame seats the calendar: the seat spans the
    // frame's border box (the overlay box spans the side borders only), so
    // the calendar hangs from the field's bottom edge, under its border
    const frameBottom = Utils.isNumber(presentation.frame.borderBottomWidth) ? presentation.frame.borderBottomWidth : presentation.borderSide;
    const overlays = parented && index === 0 ? React.createElement(View, {
      pointerEvents: 'box-none',
      style: { bottom: presentation.borderSide - frameBottom, end: 0, position: 'absolute', start: 0, top: 0 }
    }, picker.calendar === undefined ? null : picker.calendar) : null;

    // Under the OS picker the host's adapter sits where the text input draws
    const Adapter = parented ? picker.Adapter : undefined;
    const date = parented ? picker.dates[index] : null;
    const system = Adapter === undefined ? undefined : React.createElement(View, { style: { alignSelf: 'center', flexGrow: 1 } },
      React.createElement(Adapter, {
        accessibilityLabel: props.labelText,
        disabled: state.disabled === true || picker['isReadOnly'] === true,
        mode: 'date',
        onChange: function (event, next) {
          if (next instanceof Date) {
            picker.selectDate(index, { year: next.getFullYear(), month: next.getMonth(), day: next.getDate() });
          }
        },
        testID: Utils.isString(props.testID) ? props.testID + '-system' : undefined,
        value: date === null ? new Date() : new Date(date.year, date.month, date.day)
      }));

    return renderField({
      field: field,
      inputProps: parented ? {
        onKeyPress: function (event) {
          const key = event.key !== undefined ? event.key : (event.nativeEvent || {}).key;
          if (key === 'ArrowDown') {
            picker.setOpen(true);
          }
        }
      } : undefined,
      inputStyle: system === undefined ? ctx.typeStyle('date_picker_value') : { display: 'none' },
      leading: system,
      overlays: overlays,
      owner: 'DatePickerInput',
      renderInvalidIcon: false,
      presentation: presentation,
      props: Object.assign({}, props, {
        helperText: props.warn === true && Utils.isString(props.warnText) ? props.warnText : props.helperText,
        isReadOnly: picker['isReadOnly'] === true || props['isReadOnly'] === true,
        label: props.hideLabel === true ? undefined : props.labelText
      }),
      rootProps: { dataSet: { part: 'input' }, testID: props.testID },
      rootStyle: { marginEnd: marginEnd, width: width, zIndex: parented && picker.open === true ? ctx.token('stacking.dropdown') : undefined },
      trailing: icon
    });

  }

  DatePickerInputComponent.displayName = 'DatePickerInput';

  return DatePickerInputComponent;

}

DatePickerInput.spec = SPEC;
