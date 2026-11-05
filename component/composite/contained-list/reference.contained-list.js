// Info: ContainedList measurement reference. Upstream draws a labelled
// list with a sticky header, an optional search and rulers between rows.
export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  additionalTargets: Object.freeze([
    Object.freeze({ interactions: Object.freeze(['hover', 'focus', 'pressed']), name: 'clickableItem', ours: '[role="button"] > div', states: Object.freeze(['clickable']), upstream: '.cds--contained-list-item--clickable .cds--contained-list-item__content' })
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
  }
});
