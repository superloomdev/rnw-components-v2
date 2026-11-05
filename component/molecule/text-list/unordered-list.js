// Info: UnorderedList molecule. An `accessibilityRole` `list`; each
// `items` entry (`string` or `{ label, items }`) renders through
// `ctx.Registry.ListItem` with `kind: 'unordered'`; a nested child list
// indents `control.text_list_nested_indent` and marks squares, while the
// root list alone indents `control.text_list_indent`.
import SPEC from './spec.unordered-list.js';
export default function UnorderedList (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;

  function UnorderedListComponent (props) {
    const metrics = { indent: ctx.metric('UnorderedList', 'indent'), nestedIndent: ctx.metric('UnorderedList', 'nestedIndent') };
    const items = Utils.isObject(props.items) ? props.items : [];
    const nested = props.nested === true;
    return React.createElement(View, { accessibilityLabel: props.accessibilityLabel, accessibilityRole: 'list', style: { marginStart: nested ? metrics.nestedIndent : metrics.indent }, testID: props.testID },
      items.map(function (item, index) {
        const entry = Utils.isObject(item) ? item : { label: String(item) };
        return React.createElement(ctx.Registry.ListItem, { expressive: props.isExpressive === true, index: index + 1, key: index, kind: 'unordered', label: entry.label, nested: nested },
          Utils.isObject(entry.items) ? React.createElement(UnorderedListComponent, { isExpressive: props.isExpressive, items: entry.items, nested: true }) : null);
      }));
  }

  UnorderedListComponent.displayName = 'UnorderedList';
  return UnorderedListComponent;
}
UnorderedList.spec = SPEC;
