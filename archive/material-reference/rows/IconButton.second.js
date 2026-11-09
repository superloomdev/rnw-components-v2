// Info: component/molecule/button/reference.icon-button.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
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
  });
