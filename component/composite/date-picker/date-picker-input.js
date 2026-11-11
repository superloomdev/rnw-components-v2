// Info: DatePickerInput composite, one date field of a DatePicker. It
// renders only inside the picker's compound context: the label and field
// of the text-input family at the width the picker's type assigns - the
// single width, the range width (with the one-gap on the first of two),
// the simple width or its message and short answers - with the calendar
// icon at the field icon inset unless the picker is `simple`.
//
// Behavior: `useTextField` owns text, focus, hover and validation; the
// picker context supplies the type, `short`, `isReadOnly` and seat index.
// Unparented, the context default draws a single editable picker.

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

    // Init the field behavior and its state; a disabled field is never invalid
    const field = useTextField(props);
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

    // The calendar icon sits at the field's icon inset unless `simple`
    const icon = type === 'simple' ? null : React.createElement(View, {
      style: { alignSelf: 'center', marginEnd: ctx.metric('DatePickerInput', 'iconInset') }
    }, React.createElement(ctx.Registry.Icon, { color: 'icon_primary', name: 'calendar', size: ctx.metric('DatePickerInput', 'iconSize') }));

    // The first of a range's two pickers carries the one-gap
    const marginEnd = type === 'range' && props.pickerIndex === 0 ? 1 : 0;

    return renderField({
      field: field,
      owner: 'DatePickerInput',
      presentation: presentation,
      props: Object.assign({}, props, { label: props.hideLabel === true ? undefined : props.labelText, isReadOnly: picker['isReadOnly'] === true || props['isReadOnly'] === true }),
      rootProps: { dataSet: { part: 'input' }, testID: props.testID },
      rootStyle: { marginEnd: marginEnd, width: width },
      trailing: icon
    });

  }

  DatePickerInputComponent.displayName = 'DatePickerInput';

  return DatePickerInputComponent;

}

DatePickerInput.spec = SPEC;
