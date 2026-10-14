// Info: ButtonSet measurement reference. The upstream set takes `stacked`
// and `fluid` and renders its Button children; ours take the same buttons
// as `items` data. The separator is a box-shadow upstream and a drawn view
// here, so the parts compare the row and each button's box. The `open`-like
// interactions do not exist: `target` is the second button, whose focus the
// separator suppression rides. No second reference: the second system has
// no button set. The fluid set's upstream layout is container queries on
// `container-type: inline-size`, so a shrink-wrap body measures it at zero
// width and it always stacks: `body` gives it the frame's 640, matching the
// row our measured `onLayout` sees.

// Kind -> upstream kind; a kind absent here has no upstream counterpart
const KINDS = Object.freeze({
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  ghost: 'ghost',
  danger: 'danger',
  danger_tertiary: 'danger--tertiary',
  danger_ghost: 'danger--ghost'
});

// The n-th button's seat: ours wraps each item's Button in a seat view
const SEAT = function (n) {
  return ':scope > div > div:nth-child(' + n + ') > [role="button"]';
};


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement(upstream.ButtonSet, {
      stacked: props.stacked === true,
      fluid: props.fluid === true
    }, items.map(function (item) {
      return React.createElement(upstream.Button, {
        key: item.children,
        kind: KINDS[item.kind || 'primary'] || 'primary',
        disabled: item.disabled === true,
        renderIcon: typeof item.icon === 'string' ? upstream.icon(item.icon) : undefined
      }, item.children);
    }));
  },
  // The row's frame, on both pages: the upstream fluid set's container
  // queries would otherwise see a zero-width inline-size container
  body: Object.freeze({ width: 640 }),
  // The element a person hovers, presses and focuses: the second button, whose
  // focus suppresses the separators beside it
  target: Object.freeze({ upstream: '.cds--btn-set .cds--btn:nth-of-type(2)', ours: SEAT(2) }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--btn-set', ours: ':scope > div', measure: 'box' }),
    first: Object.freeze({ upstream: '.cds--btn-set .cds--btn:nth-of-type(1)', ours: SEAT(1), measure: 'box' }),
    second: Object.freeze({ upstream: '.cds--btn-set .cds--btn:nth-of-type(2)', ours: SEAT(2), measure: 'box', optional: true }),
    third: Object.freeze({ upstream: '.cds--btn-set .cds--btn:nth-of-type(3)', ours: SEAT(3), measure: 'box', optional: true })
  })
});
