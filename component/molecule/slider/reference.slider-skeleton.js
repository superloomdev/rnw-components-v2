// Lead-authored descriptor. Copy verbatim to
// component/molecule/slider/reference.slider-skeleton.js with the renderer.
export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 640 }),
  pauseAnimations: true,
  interactions: Object.freeze([]),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SliderSkeleton, { hideLabel: props.hideLabel === true });
  },
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: '[data-testid="slider-skeleton-label"]', measure: 'box' }),
    row: Object.freeze({ upstream: '.cds--slider-container', ours: '[data-testid="slider-skeleton-row"]', measure: 'box' }),
    minimum: Object.freeze({ upstream: '.cds--slider__range-label:first-of-type', ours: '[data-testid="slider-skeleton-minimum"]', measure: 'box' }),
    maximum: Object.freeze({ upstream: '.cds--slider__range-label:last-of-type', ours: '[data-testid="slider-skeleton-maximum"]', measure: 'box' }),
    host: Object.freeze({ upstream: '.cds--slider', ours: '[data-testid="slider-skeleton-track"]', measure: 'box' }),
    track: Object.freeze({ upstream: '.cds--slider__track', ours: '[data-testid="slider-skeleton-inactive"]', measure: 'box' }),
    tick: Object.freeze({ upstream: '.cds--slider__track', pseudo: '::before', translate: true, ours: '[data-testid="slider-skeleton-tick"]', measure: 'box' }),
    filled: Object.freeze({ upstream: '.cds--slider__filled-track', ours: '[data-testid="slider-skeleton-filled"]', measure: 'box' }),
    thumb: Object.freeze({ upstream: '.cds--slider__thumb', ours: '[data-testid="slider-skeleton-thumb-face"]', measure: 'box' })
  })
});
