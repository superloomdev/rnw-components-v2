// Info: Toggle measurement reference. The upstream toggle takes the label
// as `labelText`, the size as `size` and the on/off text as `labelA` and
// `labelB`; its track is the label's switch element, its handle the
// switch's `::before`, its focus ring the switch's `::after` (drawn on
// focus or press only, so the ring part is optional) and its mark the
// `::before`-sibling check the small variant draws. The second reference
// was retired (batch R).

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
    root: Object.freeze({ upstream: '.cds--toggle', ours: 'div:has(> [role="switch"])', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
    label: Object.freeze({ upstream: '.cds--toggle__label-text', ours: 'div:has(> [role="switch"]) > [dir="auto"]', measure: 'text' }),
    track: Object.freeze({ upstream: '.cds--toggle__switch', ours: 'div:has(> [role="switch"]) > div:nth-child(2) > div:nth-child(1)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'backgroundColor', 'borderBottomColor'] }),
    // The upstream handle slides by transform, which the pseudo reading cannot see, so its x is left to the pixel comparison; and once it slides,
    // the paint sampled at the reported box reads the track, so paint is out too
    handle: Object.freeze({ upstream: '.cds--toggle__switch', pseudo: '::before', ours: 'div:has(> [role="switch"]) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)', measure: 'box', compare: ['y', 'width', 'height', 'backgroundColor'], except: ['paint'] }),
    // The upstream ring is a pseudo box outside the switch; ours is an outline on the track itself, so the sampled paints answer different questions
    ring: Object.freeze({ upstream: '.cds--toggle__switch', pseudo: '::after', ours: 'div:has(> [role="switch"]) > div:nth-child(2) > div:nth-child(1)', measure: 'box', compare: ['x', 'y', 'outline'], except: ['paint'], optional: true }),
    mark: Object.freeze({ upstream: '.cds--toggle__check', ours: 'div:has(> [role="switch"]) > div:nth-child(2) > div:nth-child(1) > svg', measure: 'box', compare: ['x', 'width'], optional: true }),
    // Upstream writes the text's leading as a unitless 1.42857, which floors to a
    // 19.98px line box where our token's absolute 20 stays 20: same reported
    // line-height, but the glyph box lands one pixel differently inside. Its
    // placement in the row is already pinned by the track part, so y is out
    stateText: Object.freeze({ upstream: '.cds--toggle__text', ours: 'div:has(> [role="switch"]) > div:nth-child(2) > [dir="auto"]', measure: 'text', except: ['y'] })
  })
});
