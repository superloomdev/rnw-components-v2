// Info: Toggle measurement reference. The upstream toggle takes the label
// as `labelText`, the size as `size` and the on/off text as `labelA` and
// `labelB`; its track is the label's switch element, its handle the
// switch's `::before`, its focus ring the switch's `::after` (drawn on
// focus or press only, so the ring part is optional) and its mark the
// `::before`-sibling check the small variant draws. The second reference
// is the control alone: it draws no label and no on/off text, and its ring
// and handle live in shadow.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.Toggle, {
      id: 'reference-toggle-' + counter,
      labelText: props.label,
      toggled: props.checked === true,
      size: props.size,
      labelA: props.offText,
      labelB: props.onText,
      disabled: props.disabled === true,
      onToggle: function () {
        return undefined;
      }
    });
  },
  body: Object.freeze({ width: 320 }),
  // The element a person hovers and presses (the upstream's label carries the switch), and the one focused
  target: Object.freeze({ upstream: '.cds--toggle__label', ours: '[role="switch"]', upstreamFocus: '.cds--toggle__button' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--toggle', ours: ':scope > [role="switch"]', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
    label: Object.freeze({ upstream: '.cds--toggle__label-text', ours: '[role="switch"] > [dir="auto"]', measure: 'text' }),
    track: Object.freeze({ upstream: '.cds--toggle__switch', ours: '[role="switch"] > div > div', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'backgroundColor', 'borderBottomColor'] }),
    // The upstream handle slides by transform, which the pseudo reading cannot see, so its x is left to the pixel comparison; and once it slides,
    // the paint sampled at the reported box reads the track, so paint is out too
    handle: Object.freeze({ upstream: '.cds--toggle__switch', pseudo: '::before', ours: '[role="switch"] > div > div > div:nth-child(2)', measure: 'box', compare: ['y', 'width', 'height', 'backgroundColor'], except: ['paint'] }),
    // The upstream ring is a pseudo box outside the switch; ours is an outline on the track itself, so the sampled paints answer different questions
    ring: Object.freeze({ upstream: '.cds--toggle__switch', pseudo: '::after', ours: '[role="switch"] > div > div', measure: 'box', compare: ['x', 'y', 'outline'], except: ['paint'], optional: true }),
    mark: Object.freeze({ upstream: '.cds--toggle__check', ours: '[role="switch"] > div > div > svg', measure: 'box', compare: ['x', 'width'], optional: true }),
    // Upstream writes the text's leading as a unitless 1.42857, which floors to a
    // 19.98px line box where our token's absolute 20 stays 20: same reported
    // line-height, but the glyph box lands one pixel differently inside. Its
    // placement in the row is already pinned by the track part, so y is out
    stateText: Object.freeze({ upstream: '.cds--toggle__text', ours: '[role="switch"] > div > [dir="auto"]', measure: 'text', except: ['y'] })
  }),
  // The second reference is the switch alone: it draws no label and no
  // on/off text around it, and the small variant and its mark are a first
  // reference anatomy the second does not carry
  second: Object.freeze({
    origin: 'track',
    mount: function (React, upstream, props) {
      if (props.size === 'sm') {
        return null;
      }
      return React.createElement('md-switch', {
        selected: props.checked === true,
        disabled: props.disabled === true
      });
    },
    target: Object.freeze({ upstream: 'md-switch', ours: '[role="switch"]', upstreamFocus: 'md-switch >>> input' }),
    parts: Object.freeze({
      // The second reference paints its track and handle on `::before` skins whose
      // sizes are percentages, so the track compares as a pseudo by color and the
      // handle as its element by geometry; the pixels compare each handle fill
      track: Object.freeze({ upstream: 'md-switch >>> .track', pseudo: '::before', ours: '[role="switch"] > div > div', measure: 'box', compare: ['x', 'y', 'borderTopWidth', 'backgroundColor', 'borderBottomColor'] }),
      handle: Object.freeze({ upstream: 'md-switch >>> .handle', ours: '[role="switch"] > div > div > div:nth-child(2)', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      layer: Object.freeze({ upstream: 'md-switch >>> md-ripple', ours: '[role="switch"] > div > div > div:nth-child(1)', measure: 'box', compare: ['x', 'y', 'width', 'height'] })
    }),
    omit: Object.freeze({
      root: Object.freeze({ reason: 'the second reference draws no field around the switch', upstream: '*:has(> md-switch)' }),
      label: Object.freeze({ reason: 'the second reference draws no label', upstream: 'md-switch ~ *, md-switch >>> label' }),
      ring: Object.freeze({ reason: 'the second reference draws its focus ring inside shadow, compared by the track state colors', upstream: 'md-switch >>> md-focus-ring' }),
      mark: Object.freeze({ reason: 'the mark is a small-variant drawing the second reference does not sample', upstream: 'md-switch >>> svg' }),
      stateText: Object.freeze({ reason: 'the second reference draws no on/off text', upstream: 'md-switch ~ *, md-switch >>> .on-off' })
    })
  })
});
