// Info: Toggletip member measurement reference. Each member mounts the
// upstream element the way upstream composes it. The second reference is
// `none`.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.ToggletipActions, null,
      (props.actions || []).slice(0, 2).map(function (action, i) {
        return action.kind === 'link'
          ? React.createElement(upstream.Link, { key: i, href: action.href || '#' }, action.label)
          : React.createElement(upstream.Button, { key: i, size: 'sm' }, action.label);
      }));
  },
  parts: Object.freeze({})
});
