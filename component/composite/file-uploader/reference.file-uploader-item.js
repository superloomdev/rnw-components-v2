// Info: FileUploaderItem measurement reference. Upstream takes the same
// props; a name short enough not to be cut keeps its tooltip branch out.
// The parts compared are the row, the name, the status seat, the close
// button, the error glyph and the message's rule, title and body.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.FileUploaderItem, {
      disabled: props.disabled === true,
      errorBody: props.errorBody,
      errorSubject: props.errorSubject,
      iconDescription: props.iconDescription,
      invalid: props.invalid === true,
      name: props.name,
      size: props.size,
      status: props.status
    });
  },
  // The status seat: every state draws it, where only `edit` draws the close button
  target: Object.freeze({ upstream: '.cds--file__state-container', ours: '[data-part="state"]' }),
  parts: Object.freeze({
    item: Object.freeze({ upstream: '.cds--file__selected-file', ours: '[data-part="item"]', measure: 'box' }),
    name: Object.freeze({ upstream: '.cds--file-filename', ours: '[data-part="name"]', measure: 'text' }),
    state: Object.freeze({ upstream: '.cds--file__state-container', ours: '[data-part="state"]', measure: 'box' }),
    close: Object.freeze({ upstream: '.cds--file-close', ours: '[data-part="close"]', measure: 'box', optional: true }),
    invalidIcon: Object.freeze({ upstream: '.cds--file-invalid', ours: '[data-part="invalidIcon"] svg', measure: 'box', optional: true }),
    message: Object.freeze({ upstream: '.cds--form-requirement', ours: '[data-part="message"]', measure: 'box', optional: true }),
    errorTitle: Object.freeze({ upstream: '.cds--form-requirement__title', ours: '[data-part="errorTitle"]', measure: 'text', optional: true }),
    errorBody: Object.freeze({ upstream: '.cds--form-requirement__supplement', ours: '[data-part="errorBody"]', measure: 'text', optional: true })
  })
});
