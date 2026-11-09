// Info: The native half of the Toggle molecule. When the theme's
// `anatomy.toggle_widget` enum says `system`, the row mounts the OS switch
// through the host-injected `adapters.Switch` adapter with the theme's
// track and handle colors; any other enum value, or an absent adapter,
// draws ToggleWeb's drawing. An absent adapter under `system` reports
// `adapter_missing` once per system build and never throws.
//
// This file never reads the platform: the `toggle.js` dispatcher picks
// this half for the native platform answer.

import ToggleWeb from './toggle.web.js';


/********************************************************************
ToggleNative factory.

@param {Object} ctx - Component context

@return {Function} - The Toggle component for the native platform answer
*********************************************************************/
export default function ToggleNative (ctx) {

  const React = ctx.React;
  const { Text, View } = ctx.ReactNative;
  const { useControllableState, getA11yState, getA11yRelation, useA11yId } = ctx.behaviors;
  const WebComponent = ToggleWeb(ctx);


  /********************************************************************
  ToggleNative component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function ToggleNativeComponent (props) {

    // The adapter choice is fixed for the life of this system build, so the
    // controlled state hooks run before either branch is taken
    const disabled = props.disabled === true;
    const [checked, setChecked] = useControllableState({ value: props.checked, defaultValue: false, onChange: props.onChange });
    const labelId = useA11yId('toggle');

    const Adapter = ctx.adapters.Switch;
    const system = ctx.enum('anatomy.toggle_widget') === 'system';

    // Any drawn answer, or a `system` answer the host cannot supply, falls
    // back to the drawn half; the missing adapter is reported once
    if (!system || Adapter === undefined) {
      if (system) {
        ctx.diagnostic({ code: 'adapter_missing', adapter: 'Switch', component: 'Toggle' });
      }
      return React.createElement(WebComponent, props);
    }

    // The outer layout is the drawn field's: the label, the strut the
    // upstream grid leaves under the regular row, the row, and the state
    // text; only the drawn track and handle are replaced
    const small = props.size === 'sm';
    const stateText = ctx.enum('anatomy.switch_state_text') === 'shown';
    const label = props.label === undefined ? null : React.createElement(Text, {
      nativeID: labelId,
      style: [ctx.typeStyle('label01'), {
        color: ctx.color(disabled ? 'text_disabled' : 'text_secondary'),
        marginBottom: ctx.metric('Toggle', 'labelGap')
      }]
    }, props.label);

    return React.createElement(View, {
      style: {
        alignSelf: 'flex-start',
        flexDirection: 'column',
        paddingBottom: small ? 0 : ctx.metric('Toggle', 'labelStrut')
      }
    },
    label,
    React.createElement(View, { style: { alignItems: 'center', flexDirection: 'row' } },
      // The seat is the drawn track's box for the size; the OS switch
      // centers in it and its own bounds may overflow it
      React.createElement(View, {
        style: {
          alignItems: 'center',
          height: ctx.metric('Toggle', small ? 'trackHeightSmall' : 'trackHeight'),
          justifyContent: 'center',
          overflow: 'visible',
          width: ctx.metric('Toggle', small ? 'trackWidthSmall' : 'trackWidth')
        }
      },
      React.createElement(Adapter, Object.assign({}, getA11yState({ checked: checked, disabled: disabled || undefined }), getA11yRelation({ labelledby: labelId }), {
        accessibilityRole: 'switch',
        disabled: disabled,
        ios_backgroundColor: ctx.color('switch_track'),
        onValueChange: function (next) {
          setChecked(next);
        },
        testID: props.testID,
        thumbColor: ctx.color(checked ? 'switch_handle_selected' : 'switch_handle'),
        trackColor: {
          false: ctx.color(disabled ? 'switch_track_disabled' : 'switch_track'),
          true: ctx.color(disabled ? 'switch_track_selected_disabled' : 'switch_track_selected')
        },
        value: checked
      }))),
      // The on/off text element stays in the tree as in the drawn half,
      // so the accessibility answer is the same under every template
      React.createElement(Text, {
        'aria-hidden': true,
        style: [ctx.typeStyle('body01'), {
          color: ctx.color(disabled ? 'text_disabled' : 'text_primary'),
          display: stateText ? 'flex' : 'none',
          marginStart: ctx.metric('Toggle', 'stateTextGap')
        }]
      }, checked ? props.onText : props.offText)));

  }

  ToggleNativeComponent.displayName = 'ToggleNative';

  return ToggleNativeComponent;

}
