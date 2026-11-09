// Info: OrderedList molecule. An `accessibilityRole` `list`; each item's
// marker is `n.` (or `a.` nested; `native` still draws `n.` at the
// ordinal offset - upstream's native `::marker` has no RNW equivalent).
// The ordered root draws no margin (`_list.scss:59` resets a counter only).
import SPEC from './spec.ordered-list.js';
export default function OrderedList (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;

  function OrderedListComponent (props) {
    const metrics = { nestedIndent: ctx.metric('OrderedList', 'nestedIndent') };
    const items = Utils.isObject(props.items) ? props.items : [];
    const nested = props.nested === true;
    return React.createElement(View, { accessibilityLabel: props.accessibilityLabel, accessibilityRole: 'list', dataSet: { part: nested ? 'nestedList' : 'list' }, style: nested ? { marginStart: metrics.nestedIndent } : null, testID: props.testID },
      items.map(function (item, index) {
        const entry = Utils.isObject(item) ? item : { label: String(item) };
        return React.createElement(ctx.Registry.ListItem, { expressive: props.isExpressive === true, index: index + 1, key: index, kind: props.native === true ? 'native' : 'ordered', label: entry.label, nested: nested },
          Utils.isObject(entry.items) ? React.createElement(OrderedListComponent, { isExpressive: props.isExpressive, items: entry.items, native: props.native, nested: true }) : null);
      }));
  }

  OrderedListComponent.displayName = 'OrderedList';
  return OrderedListComponent;
}
OrderedList.spec = SPEC;
