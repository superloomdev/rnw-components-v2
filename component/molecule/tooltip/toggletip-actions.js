// Info: ToggletipActions molecule. The row at a Toggletip bubble's base: at
// most two actions spread edge to edge - a `link` renders the inverse Link,
// a `button` the small primary Button on the inverse focus ring. Composed
// only inside Toggletip.

import SPEC from './spec.toggletip-actions.js';


/********************************************************************
ToggletipActions factory.

@param {Object} ctx - Component context

@return {Function} - The ToggletipActions component
*********************************************************************/
export default function ToggletipActions (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  ToggletipActions component.

  @param {Object} props - See `api.toggletip-actions.js`

  @return {Object} - React element
  *********************************************************************/
  function ToggletipActionsComponent (props) {

    const actions = Array.isArray(props.actions) ? props.actions.slice(0, 2) : [];

    return React.createElement(View, {
      style: { backgroundColor: ctx.color('tooltip_container'), flexDirection: 'row', gap: ctx.token('spacing.spacing_05'), justifyContent: 'space-between' },
      testID: props.testID
    },
    actions.map(function (action, index) {
      if (action.kind === 'link') {
        return React.createElement(ctx.Registry.Link, {
          href: action.href,
          inverse: true,
          key: index,
          onPress: action.onPress
        }, action.label);
      }
      return React.createElement(ctx.Registry.Button, {
        focusRingLeaf: 'focus_ring_inverse',
        kind: 'primary',
        key: index,
        onPress: action.onPress,
        size: 'sm'
      }, action.label);
    }));

  }

  ToggletipActionsComponent.displayName = 'ToggletipActions';

  return ToggletipActionsComponent;

}

ToggletipActions.spec = SPEC;
