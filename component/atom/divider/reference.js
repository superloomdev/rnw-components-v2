// Info: Divider measurement reference. The primary system has no standalone
// divider (the roster records no primary twin), so the primary mount draws nothing
// for every state and the browser gates skip it. The second reference was retired (batch R). The rule is not interactive, so it has no target.

export default Object.freeze({
  kind: 'render-web',
  mount: function () {
    return null;
  },
  body: Object.freeze({ width: 320 }),
  parts: Object.freeze({})
});
