// Info: UnorderedList measurement reference. Upstream draws a `ul`: a
// dash marker before each `li`, a square inside the nested `ul`.
export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  additionalTargets: Object.freeze([]),
  body: Object.freeze({ width: 400, hang: Object.freeze({ start: 32 }) }),
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
  ,
  parts: Object.freeze({
    list: Object.freeze({ upstream: '.cds--list--unordered:not(.cds--list--nested)', ours: '[data-part="list"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'marginLeft', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight'] }),
    items: Object.freeze({ upstream: '.cds--list__item', all: true, ours: '[data-part="item"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'paddingLeft', 'color'] }),
    markers: Object.freeze({ upstream: '.cds--list__item', pseudo: '::before', all: true, ours: '[data-part="marker"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'cssLeft', 'color', 'fontSize'] }),
    nested: Object.freeze({ upstream: '.cds--list--nested', ours: '[data-part="nestedList"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'marginLeft'] }),
    nestedMarkers: Object.freeze({ upstream: '.cds--list--nested .cds--list__item', pseudo: '::before', all: true, ours: '[data-part="nestedList"] [data-part="marker"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'cssLeft'] })
  })
});
