// Info: CopyButton's measurement reference. The upstream CopyButton takes
// iconDescription/feedback/feedbackTimeout/align/onClick and nothing else;
// its tooltip bubble shows on hover, focus and during feedback. It passes
// `kind: ''`, the Default story's own argument (`CopyButton.stories.js:19`):
// at this release `_copy-button.scss:24` draws the default colors under
// `:where()`, so a bare CopyButton takes ButtonBase's `kind = "primary"`
// (`Button/ButtonBase.js:23`); the next release passes `kind ?? null` to
// restore the layer fill.

export default Object.freeze({
  kind: 'render-web',
  // The upstream bubble mounts on hover, focus or press; the harness must
  // drive those interactions to count it drawn
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: { width: 320 },
  mount: function (React, upstream, props) {
    return React.createElement(upstream.CopyButton, {
      kind: '',
      iconDescription: props.iconDescription,
      feedback: props.feedback,
      feedbackTimeout: props.feedbackTimeout,
      align: props.align,
      size: props.size,
      onClick: function () {}
    });
  },
  target: Object.freeze({ upstream: '.cds--copy-btn', ours: '[role="button"]' }),
  parts: Object.freeze({
    button: Object.freeze({ upstream: '.cds--copy-btn', ours: 'div:has(> [role="button"]) > div', measure: 'box' }),
    icon: Object.freeze({ upstream: '.cds--copy-btn svg path', ours: 'div:has(> [role="button"]) svg path', measure: 'box' }),
    tooltip: Object.freeze({ upstream: '.cds--popover-content', ours: '[role="tooltip"] > div', measure: 'box', optional: true })
  })
});
