// Info: ProgressIndicatorSkeleton measurement reference. The skeleton is
// a `.cds--progress.cds--skeleton` list of four fixed incomplete steps -
// each the dashed-circle glyph, a `__progress-label` placeholder block and
// a `__line` connector inside an unclickable `__step-button` div. The
// parts compared are the list, the first step's glyph, label block and
// line. There is no second reference: the second system has no skeleton
// primitives, so its values are a Superloom decision.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.ProgressIndicatorSkeleton, {
      vertical: props.vertical
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--progress', ours: ':scope > ul', measure: 'box' }),
    step: Object.freeze({ upstream: '.cds--progress-step:nth-child(1)', ours: ':scope > ul > li:nth-child(1)', measure: 'box' }),
    icon: Object.freeze({ upstream: '.cds--progress-step:nth-child(1) svg', ours: ':scope > ul > li:nth-child(1) svg', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--progress-step:nth-child(1) .cds--progress-label', ours: ':scope > ul > li:nth-child(1) > div > div:nth-child(2) > div', measure: 'box' }),
    line: Object.freeze({ upstream: '.cds--progress-step:nth-child(1) .cds--progress-line', ours: ':scope > ul > li:nth-child(1) > div > div:last-child', measure: 'box' })
  })
});
