// Info: Filename measurement reference. Upstream Filename draws bare
// glyphs whose every rule is scoped under the state container span its
// parents wrap it in, so the mount wraps it the same way. The parts
// compared are the seat, the close button and its glyph, the error glyph
// and the checkmark. The spinner turns, so its box is not compared.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement('span', { className: 'cds--file__state-container' },
      React.createElement(upstream.Filename, {
        disabled: props.disabled === true,
        iconDescription: props.iconDescription,
        invalid: props.invalid === true,
        name: props.name,
        status: props.status
      }));
  },
  // The status seat: every state draws it, where only `edit` draws the close button
  target: Object.freeze({ upstream: '.cds--file__state-container', ours: '[data-part="state"]' }),
  parts: Object.freeze({
    state: Object.freeze({ upstream: '.cds--file__state-container', ours: '[data-part="state"]', measure: 'box' }),
    close: Object.freeze({ upstream: '.cds--file-close', ours: '[data-part="close"]', measure: 'box', optional: true }),
    closeIcon: Object.freeze({ upstream: '.cds--file-close svg', ours: '[data-part="close"] svg', measure: 'box', optional: true }),
    invalidIcon: Object.freeze({ upstream: '.cds--file-invalid', ours: '[data-part="invalidIcon"] svg', measure: 'box', optional: true }),
    complete: Object.freeze({ upstream: '.cds--file-complete', ours: '[data-part="complete"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] })
  })
});
