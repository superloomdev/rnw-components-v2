// Info: ContainedList measurement reference. Upstream draws a labelled
// list with a sticky header, an optional search and rulers between rows.
export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  additionalTargets: Object.freeze([
    Object.freeze({ interactions: Object.freeze(['hover', 'focus', 'pressed']), name: 'clickableItem', ours: '[role="button"]:has(> [data-part="content"])', states: Object.freeze(['clickable']), upstream: '.cds--contained-list-item--clickable .cds--contained-list-item__content' })
  ]),
  body: Object.freeze({ width: 400 }),
  mount: function (React, upstream, props) {
    const items = (props.items || []).map(function (entry, index) {
      const action = entry.action === 'tag' ? React.createElement(upstream.Tag, { size: props.size === 'sm' ? 'sm' : 'md' }, 'Tag')
        : entry.action === 'button' ? React.createElement(upstream.IconButton, { kind: 'ghost', renderIcon: upstream.icon('close') }) : undefined;
      return React.createElement(upstream.ContainedListItem, { action: action, disabled: entry.disabled, key: index, onClick: entry.onPress, renderIcon: entry.icon !== undefined ? upstream.icon(entry.icon) : undefined }, entry.label);
    });
    const action = props.action === 'search' ? React.createElement(upstream.Search, { labelText: 'Search' }) : undefined;
    return React.createElement(upstream.ContainedList, { action: action, isInset: props.isInset, kind: props.kind, label: props.label, size: props.size }, items);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--contained-list', ours: '[data-part="root"]', measure: 'box', compare: ['width'] }),
    header: Object.freeze({ upstream: '.cds--contained-list__header', ours: '[data-part="header"]', measure: 'box', compare: ['height', 'backgroundColor', 'borderBottomWidth', 'borderBottomColor', 'paddingLeft', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight'] }),
    label: Object.freeze({ upstream: '.cds--contained-list__label', ours: '[data-part="label"]', measure: 'box', compare: ['color', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight'] }),
    items: Object.freeze({ upstream: '.cds--contained-list-item', all: true, ours: '[data-part="item"]', measure: 'box', compare: ['width', 'minHeight'] }),
    contents: Object.freeze({ upstream: '.cds--contained-list-item__content', all: true, ours: '[data-part="content"]', measure: 'box', compare: ['minHeight', 'paddingLeft', 'paddingRight', 'backgroundColor', 'color', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight'] }),
    rulers: Object.freeze({ upstream: '.cds--contained-list-item', pseudo: '::before', all: true, ours: '[data-part="ruler"]', measure: 'box', optional: true, compare: ['cssLeft', 'cssHeight', 'backgroundColor'] }),
    icons: Object.freeze({ upstream: '.cds--contained-list-item__icon', all: true, ours: '[data-part="icon"]', measure: 'box', optional: true, compare: ['width', 'paddingTop', 'marginRight'] }),
    actions: Object.freeze({ upstream: '.cds--contained-list-item__action', all: true, ours: '[data-part="action"]', measure: 'box', optional: true, compare: ['x', 'y'] }),
    tags: Object.freeze({ upstream: '.cds--tag', all: true, ours: '[data-part="action"] [data-testid="tag"]', measure: 'box', optional: true, compare: ['height'] }),
    search: Object.freeze({ upstream: '.cds--search', ours: '[data-part="search"]', measure: 'box', optional: true, compare: ['width', 'backgroundColor'] }),
    searchInput: Object.freeze({ upstream: '.cds--search-input', ours: '[data-part="search"] div:has(> input)', measure: 'box', optional: true, compare: ['backgroundColor', 'borderBottomColor'] })
  })
});
