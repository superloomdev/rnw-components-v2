// Info: HeaderGlobalBar member. The header's end: a row that takes the
// room the header leaves (`flex: 1 1 0%`, `_header.scss:433-438`) and
// seats its HeaderGlobalAction members from `actions`, then its children,
// at its end across the header's height. It must be composed inside
// Header.

import SPEC from './spec.header-global-bar.js';


/********************************************************************
HeaderGlobalBar factory.

@param {Object} ctx - Component context

@return {Function} - The HeaderGlobalBar component
*********************************************************************/
export default function HeaderGlobalBar (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  HeaderGlobalBar component.

  @param {Object} props - See `api.header-global-bar.js`

  @return {Object} - React element
  *********************************************************************/
  function HeaderGlobalBarComponent (props) {

    const actions = Utils.isArray(props.actions) ? props.actions : [];
    return React.createElement(View, {
      testID: props.testID,
      style: { alignSelf: 'stretch', flexBasis: 0, flexDirection: 'row', flexGrow: 1, flexShrink: 1, justifyContent: 'flex-end' }
    },
    actions.map(function (action, index) {
      return React.createElement(ctx.Registry.HeaderGlobalAction, {
        accessibilityLabel: action.label,
        icon: action.icon,
        isActive: action.isActive,
        key: index,
        onPress: action.onPress,
        tooltipAlignment: index === actions.length - 1 ? 'end' : 'center'
      });
    }),
    props.children);

  }

  HeaderGlobalBarComponent.displayName = 'HeaderGlobalBar';

  return HeaderGlobalBarComponent;

}

HeaderGlobalBar.spec = SPEC;
