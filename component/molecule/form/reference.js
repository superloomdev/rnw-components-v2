// Info: Form measurement reference. The upstream form is a plain form
// element; ours is a View that gains the `form` role only when labelled.
// The text child mounts as a block box in the same compact type the
// registry Text gives a string child. No second reference: the second
// system has no form element.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Form, {
      'aria-label': props.accessibilityLabel
    }, React.createElement('span', {
      style: Object.assign({ display: 'block' }, upstream.fixtureTextStyle('bodyCompact01'))
    }, props.children));
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > form', ours: ':scope > div', measure: 'box' })
  })
});
