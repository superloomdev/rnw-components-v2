// Info: Toggletip member measurement reference. Each member mounts the
// upstream element the way upstream composes it. The second reference is
// `none`.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Toggletip, null,
      React.createElement(upstream.ToggletipButton, { label: props.buttonLabel }, (function () {
        const literal = upstream.tokens['icon.info'];
        const sized = literal.sizes && literal.sizes['16'] ? literal.sizes['16'] : literal;
        return React.createElement('svg', { viewBox: sized.viewBox, 'aria-hidden': true, fill: 'currentColor', width: 16, height: 16 },
          sized.paths.map(function (path, index) {
            return React.createElement('path', { key: index, d: path.d, fillRule: path.fillRule });
          }));
      })()));
  },
  parts: Object.freeze({})
});
