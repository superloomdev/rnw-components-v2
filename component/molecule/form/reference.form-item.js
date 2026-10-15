// Info: FormItem measurement reference. The upstream form item is the
// column flex container in the compact body type; ours is a View column
// aligned to the start edge whose string child mounts through the
// registry Text in the same set. No second reference: the second system
// has no form item element.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.FormItem, null,
      React.createElement('span', {
        style: Object.assign({ display: 'block' }, upstream.fixtureTextStyle('bodyCompact01'))
      }, props.children));
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > div', ours: ':scope > div', measure: 'box' }),
    label: Object.freeze({ upstream: ':scope > div > span', ours: ':scope > div > [dir="auto"]', measure: 'text' })
  })
});
