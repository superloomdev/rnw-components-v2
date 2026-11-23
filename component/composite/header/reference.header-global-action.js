// Info: HeaderGlobalAction measurement reference. Upstream draws a ghost
// icon-only Button with the `cds--header__action` seat and its compact
// tooltip, in the global bar of the staged Header the sample's wrappers
// name.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: Object.freeze({ width: 800, height: 120, stage: true }),
  mount: function (React, upstream, props) {
    const Glyph = upstream.icon(props.icon);
    return React.createElement(upstream.HeaderGlobalAction, { 'aria-label': props.accessibilityLabel, isActive: props.isActive === true, tooltipAlignment: props.tooltipAlignment },
      React.createElement(Glyph, { size: 20 }));
  },
  target: Object.freeze({ upstream: '.cds--header__global .cds--header__action', ours: 'header button, [role="banner"] button' }),
  parts: Object.freeze({
    action: Object.freeze({ upstream: '.cds--header__global .cds--header__action', ours: 'header button, [role="banner"] button', measure: 'box' }),
    glyph: Object.freeze({ upstream: '.cds--header__global .cds--header__action svg path', ours: 'header button svg path, [role="banner"] button svg path', measure: 'box' })
  })
});
