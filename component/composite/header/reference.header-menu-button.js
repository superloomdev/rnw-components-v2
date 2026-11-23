// Info: HeaderMenuButton measurement reference. Upstream draws a
// `button.cds--header__menu-toggle` with the 20 menu glyph (close while
// active), inside the staged Header the sample's wrapper names. A toggle
// that does not collapse is `display: none` from lg, so that state has no
// upstream drawing in a wide window and the narrow set draws it.

// The window width upstream's `breakpoint('lg')` starts at
const LG = 1056;

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: Object.freeze({ width: 800, height: 120, stage: true }),
  // Shown below lg only without `isCollapsible`, read from the window
  // (`ui-shell/header/_header.scss:149-153`): the narrow set draws a 320
  // body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
  mount: function (React, upstream, props) {
    if (props.isCollapsible !== true && typeof window !== 'undefined' && window.innerWidth >= LG) {
      return null;
    }
    return React.createElement(upstream.HeaderMenuButton, { 'aria-label': props.accessibilityLabel, isActive: props.isActive === true, isCollapsible: props.isCollapsible === true });
  },
  target: Object.freeze({ upstream: '.cds--header__menu-toggle', ours: 'header > button, [role="banner"] > button' }),
  parts: Object.freeze({
    toggle: Object.freeze({ upstream: '.cds--header__menu-toggle', ours: 'header > button, [role="banner"] > button', measure: 'box' }),
    glyph: Object.freeze({ upstream: '.cds--header__menu-toggle svg path', ours: 'header > button svg path, [role="banner"] > button svg path', measure: 'box' })
  })
});
