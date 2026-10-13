// Info: Link measurement reference. The upstream link takes `href` (none
// while disabled), `inline`, `disabled`, `size` and a `renderIcon`
// component for the trailing glyph. `visited` mounts nothing: no page can
// drive `:visited`, so that state is unmeasured. No second reference - the
// second system's text-button twin is a 40px pill button, not a link.
// Ours splits the face from the pressable target: `root` is the face (the
// upstream anchor's own box), `target` stays the `[role="link"]` pressable
// that covers it at no smaller than the platform target.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    if (props.visited === true) {
      return null;
    }
    return React.createElement(upstream.Link, {
      href: props.disabled === true ? undefined : props.href,
      inline: props.inline === true,
      disabled: props.disabled === true,
      size: props.size,
      renderIcon: props.icon ? upstream.icon(props.icon) : undefined
    }, props.children);
  },
  target: Object.freeze({ upstream: 'a.cds--link', ours: '[role="link"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--link', ours: ':scope > div > div:first-child', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--link', ours: ':scope > div > div:first-child > [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: '.cds--link__icon path', ours: ':scope > div > div:first-child svg path', measure: 'box' })
  })
});
