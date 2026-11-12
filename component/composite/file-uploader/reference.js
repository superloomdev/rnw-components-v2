// Info: FileUploader measurement reference. Upstream takes the same props
// (the legacy shape); its list fills only by a pick, so every state draws
// the title, the description, the button and the empty list container.
// The parts compared are the first three and the root's box, whose
// height carries the empty list's gap (the container itself draws nothing).

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.FileUploader, {
      buttonKind: props.buttonKind,
      buttonLabel: props.buttonLabel,
      disabled: props.disabled === true,
      filenameStatus: props.filenameStatus,
      labelDescription: props.labelDescription,
      labelTitle: props.labelTitle,
      size: props.size
    });
  },
  target: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"]' }),
  parts: Object.freeze({
    title: Object.freeze({ upstream: '.cds--file--label', ours: '[data-part="title"]', measure: 'text' }),
    description: Object.freeze({ upstream: '.cds--label-description', ours: '[data-part="description"]', measure: 'text' }),
    button: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"]', measure: 'box' }),
    root: Object.freeze({ upstream: '.cds--form-item', ours: '[data-part="root"]', measure: 'box', compare: ['x', 'y', 'width', 'height'] })
  })
});
