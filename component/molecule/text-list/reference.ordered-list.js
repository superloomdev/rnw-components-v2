// Info: OrderedList measurement reference. Upstream draws an `ol`: `n.`
// markers (lower-latin `a.` nested); `native` uses the browser's decimal
// `::marker`.
export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  additionalTargets: Object.freeze([]),
  body: Object.freeze({ width: 400 }),
  mount: function (React, upstream, props) {
    const items = (props.items || []).map(function (entry, index) {
      const object = typeof entry === 'object';
      return React.createElement(upstream.ListItem, { key: index }, object ? entry.label : String(entry),
        object && Array.isArray(entry.items) ? React.createElement(upstream.OrderedList, { native: props.native, nested: true },
          entry.items.map(function (child, childIndex) {
            return React.createElement(upstream.ListItem, { key: childIndex }, typeof child === 'object' ? child.label : String(child));
          })) : null);
    });
    return React.createElement(upstream.OrderedList, { isExpressive: props.isExpressive, native: props.native }, items);
  }
});
