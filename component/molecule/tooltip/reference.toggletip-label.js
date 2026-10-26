// Info: Toggletip member measurement reference. Each member mounts the
// upstream element the way upstream composes it. The second reference is
// `none`.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.ToggletipLabel, null, props.children);
  },
  parts: Object.freeze({})
});
