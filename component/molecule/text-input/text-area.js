// Info: TextArea molecule. A field root holding the label row (label plus,
// where the theme's `anatomy.field_counter` says `label`, the counter), the
// multi-line frame and the message row (message plus, under `message`, the
// counter). The frame has no fixed height: `rows` value lines size it, with
// a minimum of one field height and block padding equal to the room one
// value line takes centered in it. Composes the `useTextField` behavior and
// draws the theme's `feedback.field` frame and `anatomy.label` placement
// through the context's field presentation as member `text_area`. Both
// counter slots mount when `maxCount` is given and only the theme's draws,
// so the element tree never depends on the template.

import SPEC from './spec.text-area.js';


/********************************************************************
TextArea factory.

@param {Object} ctx - Component context

@return {Function} - The TextArea component
*********************************************************************/
export default function TextArea (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const NativeTextInput = ctx.ReactNative.TextInput;
  const { useTextField } = ctx.behaviors;


  /********************************************************************
  TextArea component.

  @param {Object} props - See `api.text-area.js`

  @return {Object} - React element
  *********************************************************************/
  function TextAreaComponent (props) {

    // Init the behavior and its state; a disabled field is never invalid
    const field = useTextField(Object.assign({}, props, { invalid: props.invalid === true && props.disabled !== true }));
    const state = field.state;
    const invalid = state.invalid;
    const labelled = Utils.isString(props.label) && !Utils.isEmptyString(props.label);

    // Read the theme's field presentation as the text_area member
    const surface = Utils.isString(props.surface) ? props.surface
      : Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background';
    const minHeight = ctx.metric('TextArea', 'minHeight');
    const presentation = ctx.fieldPresentation({
      disabled: state.disabled,
      focused: state.focused,
      hovered: state.hovered,
      invalid: invalid,
      populated: state.populated
    }, {
      member: 'text_area',
      height: minHeight,
      radius: ctx.metric('TextArea', 'radius'),
      surface: surface,
      trailing: invalid
    });

    // The frame's own delta: no fixed height, one line of block padding
    // centered on the minimum, and the icon anchored at the frame's top.
    // Where the frame draws its edge on every side (the outline mode), the
    // drawn width comes back out of the block padding: upstream draws that
    // edge free of the content box, so a real border would grow the frame
    const paddingBlock = (minHeight - ctx.typeStyle('field_value').lineHeight) / 2;
    const edgeBlock = parseFloat(presentation.frame.borderWidth) || 0;
    const frame = Object.assign({}, presentation.frame);
    delete frame.height;
    frame.alignItems = 'flex-start';
    frame.minHeight = minHeight;
    frame.paddingBottom = paddingBlock - edgeBlock;
    frame.paddingTop = paddingBlock - edgeBlock;

    // The label row is the label's parent and it sits at the frame's top,
    // while the family's floating top is measured from the root (which keeps
    // a reserve for the raised label); the reserve comes back out here
    const label = Object.assign({}, presentation.label);
    if (Utils.isNumber(label.top)) {
      label.top = label.top - ctx.typeStyle('field_label_raised').lineHeight / 2;
    }

    // The counter reads the field's own count and the limit; both its
    // possible seats mount so the element tree stays the same under every
    // template, and only the theme's placement draws
    const counts = Utils.isNumber(props.maxCount);
    const counterPlace = ctx.enum('anatomy.field_counter');
    const counterText = counts ? String(Utils.isString(state.value) ? state.value.length : 0) + '/' + String(props.maxCount) : null;

    // Render the error icon at the frame's top while invalid
    const icon = invalid ? React.createElement(View, { style: { end: ctx.metric('TextArea', 'iconInsetEnd'), position: 'absolute', top: ctx.metric('TextArea', 'iconInsetTop') } },
      React.createElement(ctx.Registry.Icon, { name: 'invalid', size: ctx.metric('TextArea', 'iconSize'), color: presentation.invalidIcon })) : null;

    // Render the message below: the error while invalid, else the helper
    const message = invalid && Utils.isString(props.invalidText) ? props.invalidText
      : Utils.isString(props.helperText) ? props.helperText : null;

    // Render the root, the label row, the frame with the input, and the message row
    return React.createElement(View, Object.assign({}, field.rootProps, { style: [{ position: 'relative' }, presentation.root] }),
      React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between' } },
        labelled ? React.createElement(Text, Object.assign({}, field.labelProps, { style: label }), props.label) : null,
        React.createElement(Text, {
          style: [label, { display: counts && counterPlace === 'label' ? 'flex' : 'none' }]
        }, counterText === null ? '' : counterText)
      ),
      React.createElement(View, { style: frame },
        React.createElement(NativeTextInput, Object.assign({}, field.inputProps, {
          accessibilityLabel: props.accessibilityLabel,
          maxLength: counts ? props.maxCount : undefined,
          multiline: true,
          placeholder: presentation.placeholder || !labelled ? props.placeholder : undefined,
          placeholderTextColor: presentation.placeholderColor,
          rows: Utils.isNumber(props.rows) ? props.rows : 4,
          testID: props.testID,
          style: [presentation.value, {
            alignSelf: 'stretch',
            backgroundColor: 'transparent',
            opacity: labelled && !presentation.placeholder ? 0 : 1,
            flexBasis: 'auto',
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 0,
            outlineStyle: 'none'
          }]
        })),
        icon
      ),
      message === null && !counts ? null : React.createElement(View, { style: { flexDirection: 'row', justifyContent: message === null ? 'flex-end' : 'space-between' } },
        message === null ? null : React.createElement(Text, { style: presentation.message }, message),
        React.createElement(Text, {
          style: [presentation.message, { display: counts && counterPlace === 'message' ? 'flex' : 'none', marginStart: 0, marginEnd: ctx.metric('TextArea', 'messageInset') }]
        }, counterText === null ? '' : counterText)
      )
    );

  }

  TextAreaComponent.displayName = 'TextArea';

  return TextAreaComponent;

}

TextArea.spec = SPEC;
