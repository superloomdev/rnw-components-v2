// Info: TimePicker molecule, the text-input family's timed member. One
// label names the whole row: a plain-text time field in the family's
// frame at the theme's fixed time width, then the select members (or
// ordinary children) at the theme's select gap, with the message below
// the row. Text entry only - no auto-format; the clock-dial picker is
// the second system's deferred anatomy, not a part the primary draws.
//
// Behavior: `useTextField` owns text, focus, hover, validation and the
// label relation - the input names itself by the one label drawn at the
// outer root. The member reads its size through the `TimePicker`
// compound context the row publishes; its own accessible name stays
// its own. Disabled row descendants inherit disabled through the shared
// DisabledContext, so a member's `disabled: false` cannot re-enable it.

import SPEC from './spec.time-picker.js';
import createFieldParts from './field-parts.js';


/********************************************************************
TimePicker factory.

@param {Object} ctx - Component context

@return {Function} - The TimePicker component
*********************************************************************/
export default function TimePicker (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const { useTextField, getCompoundContext } = ctx.behaviors;
  const { renderField } = createFieldParts(ctx);

  // The family's compound context, cached on this behavior system
  const Compound = getCompoundContext('TimePicker');

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


  /********************************************************************
  TimePicker component.

  @param {Object} props - See `api.time-picker.js`

  @return {Object} - React element
  *********************************************************************/
  function TimePickerComponent (props) {

    // Init the behavior and its state; a disabled field is never invalid
    const field = useTextField(props);
    const state = field.state;
    const invalid = state.invalid === true && state.disabled !== true;

    // Read the geometry and the theme's field presentation
    const height = ctx.metric('TimePicker', SIZES[props.size] || 'height');
    const size = props.size === 'sm' || props.size === 'lg' ? props.size : 'md';
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
      radius: ctx.metric('TimePicker', 'radius'),
      surface: surface,
      trailing: true
    });

    // The members after the field: the `selects` data composes the
    // registry member; ordinary children append after them as they are,
    // text scalars wrapped so a native tree can draw them
    const selectMembers = Utils.isArray(props.selects) ? props.selects.map(function (descriptor, index) {
      return React.createElement(ctx.Registry.TimePickerSelect, Object.assign({ key: index }, descriptor));
    }) : [];
    const childMembers = React.Children.map(props.children, function (child) {
      return typeof child === 'string' || typeof child === 'number'
        ? React.createElement(Text, null, child)
        : child;
    });
    const members = selectMembers.concat(childMembers === null ? [] : childMembers);

    // The message below the whole row: the error while invalid, else the helper
    const message = invalid && Utils.isString(props.invalidText) ? props.invalidText
      : Utils.isString(props.helperText) ? props.helperText : null;

    // The invalid glyph is an overlay inset from the frame's end edge, not
    // an in-flow icon: the widened field makes the room, the overlay a row
    // of explicit field height centers the glyph's own box
    const invalidOverlay = invalid ? React.createElement(View, {
      pointerEvents: 'none',
      style: {
        alignItems: 'center',
        end: ctx.metric('TimePicker', 'invalidIconInset'),
        flexDirection: 'row',
        height: height,
        position: 'absolute',
        top: 0
      }
    }, React.createElement(View, {
      style: {
        marginEnd: ctx.metric('TimePicker', 'invalidIconMarginEnd'),
        marginStart: ctx.metric('TimePicker', 'invalidIconMarginStart'),
        marginTop: ctx.metric('TimePicker', 'invalidIconMarginTop')
      }
    }, React.createElement(ctx.Registry.Icon, {
      name: 'invalid',
      size: ctx.metric('TimePicker', 'iconSize'),
      color: presentation.invalidIcon
    }))) : undefined;

    return React.createElement(Compound.Provider, {
      value: {
        disabled: state.disabled,
        size: size
      }
    },
    React.createElement(View, { style: [{ position: 'relative' }, presentation.root] },
      Utils.isString(props.label) && !Utils.isEmptyString(props.label)
        ? React.createElement(Text, Object.assign({}, field.labelProps, { style: presentation.label }), props.label)
        : null,
      React.createElement(ctx.behaviors.DisabledContext.Provider, { value: state.disabled },
        React.createElement(View, {
          style: {
            alignSelf: 'flex-start',
            flexDirection: 'row',
            // A second-system row wraps rather than overflowing its cell
            flexWrap: 'wrap',
            gap: ctx.metric('TimePicker', 'selectGap'),
            maxWidth: 100 + '%'
          }
        },
        renderField({
          owner: 'TimePicker',
          props: Object.assign({}, props, {
            placeholder: Utils.isString(props.placeholder) ? props.placeholder : 'hh:mm'
          }),
          field: field,
          presentation: presentation,
          renderInvalidIcon: false,
          renderLabel: false,
          renderMessage: false,
          // The parent owns the label reserve and the message; the field
          // itself shrink-wraps the theme's fixed time width, widened for
          // the error icon while invalid
          rootStyle: {
            paddingTop: 0,
            width: invalid ? ctx.metric('TimePicker', 'widthInvalid') : ctx.metric('TimePicker', 'width')
          },
          inputProps: {
            maxLength: Utils.isNumber(props.maxLength) ? props.maxLength : 5
          },
          inputStyle: ctx.typeStyle('time_picker_value'),
          overlays: invalidOverlay
        }),
        members)),
      message === null ? null : React.createElement(Text, { style: presentation.message, testID: 'time-picker-message' }, message)));

  }

  TimePickerComponent.displayName = 'TimePicker';

  return TimePickerComponent;

}

TimePicker.spec = SPEC;
