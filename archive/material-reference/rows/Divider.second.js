// Info: component/atom/divider/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
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
  });
