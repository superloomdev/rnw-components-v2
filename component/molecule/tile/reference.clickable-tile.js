// Info: ClickableTile measurement reference. The upstream tile is the `a`
// (or inert anchor); `renderIcon` draws the corner glyph that ours takes as
// the `icon` name.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.ClickableTile, {
      disabled: props.disabled === true,
      href: '#',
      renderIcon: props.icon ? upstream.icon(props.icon) : undefined
    }, props.children);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tile--clickable', ours: ':scope > a, :scope > button', measure: 'box' }),
    icon: Object.freeze({ upstream: '.cds--tile--icon, .cds--tile--disabled-icon', ours: ':scope svg', measure: 'box', optional: true })
  })
});
