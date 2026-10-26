// Info: SelectItemGroup's reference mounts. Neither reference system draws
// an option group header of its own, so primary `mount` returns null and
// there is no second; the group's values are a Superloom decision.

export default Object.freeze({
  kind: 'render-web',
  mount: function () {
    return null;
  },
  body: Object.freeze({ width: 320 }),
  parts: Object.freeze({})
});
