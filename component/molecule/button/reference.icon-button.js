// Info: IconButton measurement reference. The upstream icon button is the
// button base inside a compact tooltip: `label` names it, the kind and the
// size class it, `isSelected` marks the toggle, and the one icon is a
// cloned element. The parts compared are the square and its icon; the
// tooltip itself is the Tooltip row's concern, so the popover part here is
// optional and only proves the compact cells it shares. The second
// reference is the icon button family: the standard element answers
// `ghost`, outlined answers `tertiary`, filled answers `primary` and
// filled-tonal answers `secondary`; it has no sizes, so a sample naming
// `sm` or `md` is unmeasured there; its icon is a slotted glyph the mount
// draws from the theme's own icon token.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.IconButton, {
      label: props.label,
      kind: props.kind,
      size: props.size,
      disabled: props.disabled === true,
      isSelected: props.selected
    }, React.createElement(upstream.icon(props.icon), { size: 16 }));
  },
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: '.cds--btn--icon-only', ours: '[role="button"]' }),
  parts: Object.freeze({
    // The measured square is the face; the pressable above it is a wider,
    // transparent hit layer
    root: Object.freeze({ upstream: '.cds--btn--icon-only', ours: '[data-testid="icon-button-face"]', measure: 'box' }),
    icon: Object.freeze({ upstream: '.cds--btn--icon-only svg', ours: '[data-testid="icon-button-face"] svg', measure: 'box' }),
    bubble: Object.freeze({ upstream: '.cds--popover-content', ours: '[role="tooltip"] > div', measure: 'box', optional: true, compare: ['backgroundColor', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] })
  }),
  second: Object.freeze({
    origin: 'root',
    mount: function (React, upstream, props) {
      if (props.size !== undefined && props.size !== 'lg') {
        return null;
      }
      // The family answers four of our kinds; `secondary` has no counterpart
      // (its upstream face is the tonal kind, which the roster's icon button
      // does not ship), as in the labelled button's second reference
      const ELEMENT = {
        primary: 'md-filled-icon-button',
        ghost: 'md-icon-button',
        tertiary: 'md-outlined-icon-button'
      };
      const elementName = ELEMENT[props.kind || 'primary'];
      if (elementName === undefined) {
        return null;
      }
      const glyph = upstream.tokens['icon.' + props.icon];
      // `fill="currentColor"`: the element colors the slot's `color`, and the
      // glyph inherits it as the ink (a bare svg reads black either way)
      const icon = glyph ? React.createElement('svg', { viewBox: glyph.viewBox, fill: 'currentColor' },
        glyph.paths.map(function (path, index) {
          return React.createElement('path', { key: index, d: path.d, fillRule: path.fillRule });
        })) : null;
      return React.createElement(elementName, {
        'aria-label': props.label,
        disabled: props.disabled === true ? true : undefined,
        toggle: props.selected !== undefined ? true : undefined,
        selected: props.selected === true ? true : undefined
      }, icon);
    },
    parts: Object.freeze({
      // The internal button is the square; its painted face is a `::before`
      // the standard kind does not even mount, so geometry is the shared
      // contract here - fill, radius and the outline are the paint pixels'
      // and the screenshot's to compare
      root: Object.freeze({ upstream: 'md-icon-button >>> button, md-filled-icon-button >>> button, md-filled-tonal-icon-button >>> button, md-outlined-icon-button >>> button', ours: '[data-testid="icon-button-face"]', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      icon: Object.freeze({ upstream: 'md-icon-button svg, md-filled-icon-button svg, md-filled-tonal-icon-button svg, md-outlined-icon-button svg', ours: '[data-testid="icon-button-face"] svg', measure: 'box' })
    }),
    omit: Object.freeze({
      bubble: Object.freeze({ reason: 'the second reference mounts no tooltip; ours names the icon button with a compact one', upstream: 'md-icon-button [role="tooltip"], md-filled-icon-button [role="tooltip"], md-filled-tonal-icon-button [role="tooltip"], md-outlined-icon-button [role="tooltip"]' })
    })
  })
});
