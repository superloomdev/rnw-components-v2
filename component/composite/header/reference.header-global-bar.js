// Info: HeaderGlobalBar measurement reference. Upstream draws a
// `div.cds--header__global` taking the header's remaining room with the
// actions at its end, inside the staged Header the sample's wrapper names.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 800, height: 120, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.HeaderGlobalBar, null, props.actions.map(function (action, index) {
      const Glyph = upstream.icon(action.icon);
      return React.createElement(upstream.HeaderGlobalAction, { 'aria-label': action.label, key: index, tooltipAlignment: index === props.actions.length - 1 ? 'end' : 'center' },
        React.createElement(Glyph, { size: 20 }));
    }));
  },
  parts: Object.freeze({
    bar: Object.freeze({ upstream: '.cds--header__global', ours: 'header > div:has(button), [role="banner"] > div:has(button)', measure: 'box' }),
    actions: Object.freeze({ upstream: '.cds--header__global .cds--header__action', all: true, ours: 'header button, [role="banner"] button', measure: 'box' })
  })
});
