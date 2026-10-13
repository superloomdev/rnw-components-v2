// Info: Divider measurement reference. The primary system has no standalone
// divider (the roster records no primary twin), so the primary mount draws nothing
// for every state and the browser gates skip it. The second reference is
// `md-divider`: its host is a flex row whose `::before` draws the line at
// `currentColor` inside the host's inset padding - the same row-plus-line
// anatomy ours draws. The rule is not interactive, so it has no target.

export default Object.freeze({
  kind: 'render-web',
  mount: function () {
    return null;
  },
  body: Object.freeze({ width: 320 }),
  parts: Object.freeze({}),
  second: Object.freeze({
    body: Object.freeze({ width: 320 }),
    mount: function (React, upstream, props) {
      return React.createElement('md-divider', {
        inset: props.inset === true,
        'inset-start': props.insetStart === true,
        'inset-end': props.insetEnd === true
      });
    },
    parts: Object.freeze({
      root: Object.freeze({ upstream: 'md-divider', ours: ':scope > div', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      line: Object.freeze({ upstream: 'md-divider', pseudo: '::before', ours: ':scope > div > div', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'] })
    })
  })
});
