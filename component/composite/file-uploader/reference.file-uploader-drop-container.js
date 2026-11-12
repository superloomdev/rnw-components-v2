// Info: FileUploaderDropContainer measurement reference. Upstream takes
// the same `labelText` and `disabled` and draws the dashed area as a
// button inside a full-width wrapper. The parts compared are the area and
// its label.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.FileUploaderDropContainer, {
      disabled: props.disabled === true,
      labelText: props.labelText
    });
  },
  target: Object.freeze({ upstream: '.cds--file__drop-container', ours: '[data-part="drop"]' }),
  parts: Object.freeze({
    drop: Object.freeze({ upstream: '.cds--file__drop-container', ours: '[data-part="drop"]', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--file__drop-container', ours: '[data-part="label"]', measure: 'text' })
  })
});
