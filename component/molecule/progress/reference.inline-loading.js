// Info: InlineLoading measurement reference. The primary's row holds an
// `__animation` block (the small Loading while `active`, a filled status
// icon for `finished` or `error`, nothing while `inactive`) and an
// `__text` status line. The row is not interactive, so it has no target.
// The parts compared are the root, the mark's seat and the text. There is
// no second reference: the second system has no inline-loading row, so
// its values are a Superloom decision.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.InlineLoading, {
      description: props.description,
      iconDescription: props.iconDescription,
      onSuccess: typeof props.onSuccess === 'function' ? function () {
        return undefined;
      } : undefined,
      status: props.status,
      successDelay: props.successDelay
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--inline-loading', ours: ':scope > div', measure: 'box' }),
    animation: Object.freeze({ upstream: '.cds--inline-loading__animation', ours: '[data-testid="inline-loading-mark"]', measure: 'box', optional: true }),
    text: Object.freeze({ upstream: '.cds--inline-loading__text', ours: ':scope > div > [dir="auto"]', measure: 'text' })
  })
});
