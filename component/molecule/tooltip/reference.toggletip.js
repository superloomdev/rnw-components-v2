// Info: Toggletip member measurement reference. Each member mounts the
// upstream element the way upstream composes it. The second reference is
// `none`.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center' } },
      React.createElement(upstream.ToggletipLabel, null, props.label),
      React.createElement(upstream.Toggletip, { align: props.align, autoAlign: props.autoAlign === true, defaultOpen: props.defaultOpen === true },
        React.createElement(upstream.ToggletipButton, { label: props.buttonLabel }, (function () {
          const literal = upstream.tokens['icon.info'];
          const sized = literal.sizes && literal.sizes['16'] ? literal.sizes['16'] : literal;
          return React.createElement('svg', { viewBox: sized.viewBox, 'aria-hidden': true, fill: 'currentColor', width: 16, height: 16 },
            sized.paths.map(function (path, index) {
              return React.createElement('path', { key: index, d: path.d, fillRule: path.fillRule });
            }));
        })()),
        React.createElement(upstream.ToggletipContent, null,
          React.createElement('p', null, props.content),
          props.actions === undefined ? null : React.createElement(upstream.ToggletipActions, null,
            props.actions.slice(0, 2).map(function (action, i) {
              return action.kind === 'link'
                ? React.createElement(upstream.Link, { key: i, href: action.href || '#' }, action.label)
                : React.createElement(upstream.Button, { key: i, size: 'sm' }, action.label);
            })))));
  },
  parts: Object.freeze({})
});
