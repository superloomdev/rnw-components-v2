// Info: ListItem - one row of a text list. The label paints
// `color.text_list_label` in the list's type; the marker is an
// `aria-hidden` text run placed `-offset` before the item's
// padding-box start: en dash unordered, square nested unordered,
// `n.` ordered (lower-latin `a.` nested).
import SPEC from './spec.list-item.js';
export default function ListItem (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;

  function ListItemComponent (props) {
    const kind = Utils.isString(props.kind) ? props.kind : 'unordered';
    const metrics = {
      markerOffset: ctx.metric('ListItem', 'markerOffset'), nestedItemPadding: ctx.metric('ListItem', 'nestedItemPadding'),
      nestedMarkerOffset: ctx.metric('ListItem', 'nestedMarkerOffset'), ordinalOffset: ctx.metric('ListItem', 'ordinalOffset')
    };
    const glyph = kind === 'unordered' ? (props.nested === true ? '▪' : '–') : kind === 'ordered' ? (props.nested === true ? String.fromCharCode(96 + (Utils.isNumber(props.index) ? props.index : 1)) + '.' : (Utils.isNumber(props.index) ? props.index : 1) + '.') : (Utils.isNumber(props.index) ? props.index : 1) + '.';
    const offset = kind === 'unordered' ? (props.nested === true ? metrics.nestedMarkerOffset : metrics.markerOffset) : metrics.ordinalOffset;
    const type = ctx.typeStyle(props.expressive === true ? 'text_list_expressive' : 'text_list');
    const labelColor = ctx.color('text_list_label');
    return React.createElement(View, { accessibilityRole: 'listitem', dataSet: { part: 'item' }, style: { position: 'relative', paddingStart: props.nested === true ? metrics.nestedItemPadding : 0 }, testID: props.testID },
      // _list.scss:70,86,95 inset-inline-start: the marker follows the writing direction
      React.createElement(Text, { 'aria-hidden': true, dataSet: { part: 'marker' }, style: [type, { color: labelColor, start: -offset, position: 'absolute' }] }, glyph),
      React.createElement(Text, { style: [type, { color: labelColor }] }, props.label),
      props.children);
  }

  ListItemComponent.displayName = 'ListItem';
  return ListItemComponent;
}
ListItem.spec = SPEC;
