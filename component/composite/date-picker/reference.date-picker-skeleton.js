// Info: DatePickerSkeleton measurement reference. The upstream skeleton
// takes `range` and `hideLabel`; it draws a label bar over an input bar -
// two pairs side by side for `range`. The parts compared are the bars' and
// containers' boxes. A skeleton answers no interaction, so it has no
// target. No second reference: the second system has no skeleton.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.DatePickerSkeleton, {
      hideLabel: props.hideLabel === true,
      range: props.range === true
    });
  },
  parts: Object.freeze({
    container: Object.freeze({ upstream: '.cds--date-picker-container', ours: '[data-part="container"]', all: true, measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--date-picker-container .cds--label', ours: '[data-testid="date-picker-skeleton-label"]', all: true, optional: true, measure: 'box' }),
    input: Object.freeze({ upstream: '.cds--date-picker__input.cds--skeleton', ours: '[data-testid="date-picker-skeleton-input"]', all: true, measure: 'box' })
  })
});
