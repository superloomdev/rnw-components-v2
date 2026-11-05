// Info: UnorderedList measurement reference. Upstream draws a `ul`: a
// dash marker before each `li`, a square inside the nested `ul`.
export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 400 }),
  mount: function (React, upstream, props) {
    const items = (props.items || []).map(function (entry, index) {
      const object = typeof entry === 'object';
      return React.createElement(upstream.ListItem, { key: index }, object ? entry.label : String(entry),
        object && Array.isArray(entry.items) ? React.createElement(upstream.UnorderedList, { isExpressive: props.isExpressive, nested: true },
          entry.items.map(function (child, childIndex) {
            return React.createElement(upstream.ListItem, { key: childIndex }, typeof child === 'object' ? child.label : String(child));
          })) : null);
    });
    return React.createElement(upstream.UnorderedList, { isExpressive: props.isExpressive }, items);
  }
});
