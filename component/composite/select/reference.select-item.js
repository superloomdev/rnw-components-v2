// Info: SelectItem's reference mounts. The primary reference draws a native
// option only inside its own select, so primary `mount` returns null; the
// second reference was retired (batch R).

export default Object.freeze({
  kind: 'render-web',
  mount: function () {
    return null;
  },
  body: Object.freeze({ width: 320 }),
  parts: Object.freeze({})
});
