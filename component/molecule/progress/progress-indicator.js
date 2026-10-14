// Info: ProgressIndicator molecule. The ordered list of ProgressStep
// children: each `items` entry mounts a step with its state from
// `currentIndex` - before it `complete`, at it `current` unless the entry
// already passed `complete`, after it incomplete - and with the
// indicator's `vertical`, `spaceEqually` and `onChange` (as the step's
// `onPress`, fired with the step's index), the reference's clone math.
//
// Behavior: none of its own - each step carries its own press.
//
// Accessibility: a list of list items; each step's pressable names itself
// with the label and state sentence.

import SPEC from './spec.progress-indicator.js';


/********************************************************************
ProgressIndicator factory.

@param {Object} ctx - Component context

@return {Function} - The ProgressIndicator component
*********************************************************************/
export default function ProgressIndicator (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  ProgressIndicator component.

  @param {Object} props - See `api.progress-indicator.js`

  @return {Object} - React element
  *********************************************************************/
  function ProgressIndicatorComponent (props) {

    // Init the index and the composition props every step receives; the
    // space-equal treatment only applies while horizontal, as upstream
    const vertical = props.vertical === true;
    const spaceEqually = props.spaceEqually === true && !vertical;
    const currentIndex = Utils.isNumber(props.currentIndex) ? props.currentIndex : 0;
    const onChange = typeof props.onChange === 'function' ? props.onChange : null;
    const items = Utils.isArray(props.items) ? props.items : [];

    // Render the list, mounting each step with its entry's props plus the
    // injected state and composition
    return React.createElement(View, {
      accessibilityRole: 'list',
      testID: props.testID,
      style: {
        alignSelf: 'flex-start',
        flexDirection: vertical ? 'column' : 'row'
      }
    }, items.map(function (entry, index) {
      const onPress = onChange === null ? undefined : function () {
        onChange(index);
      };
      const injected = index === currentIndex
        ? { complete: entry.complete, current: !entry.complete }
        : index < currentIndex
          ? { complete: true }
          : { complete: entry.complete || false };
      return React.createElement(ctx.Registry.ProgressStep, Object.assign({}, entry, injected, {
        key: index,
        onPress: onPress,
        spaceEqually: spaceEqually,
        vertical: vertical
      }));
    }));

  }

  ProgressIndicatorComponent.displayName = 'ProgressIndicator';

  return ProgressIndicatorComponent;

}

ProgressIndicator.spec = SPEC;
