// Info: Tooltip measurement reference. The upstream tooltip clones a child
// element as its trigger, delays the popover 100 ms on entry and 300 ms on
// leave, and mounts it inline beside the trigger wrapper as a
// `.cds--popover-content` span holding the label and a `.cds--popover-caret`.
// Its popover stays mounted `aria-hidden` while closed; ours mounts only
// open, so the popover parts are `optional` and measured while open, through
// the `hover` and `focus` interactions or a `defaultOpen` mount. The
// popover's absolute coordinates depend on the cell's own layout, so the
// comparison reads its fill, padding and radius, the label's type, and the
// caret's clipped box, not its x/y. The second reference is `none`: the
// roster answers the compact geometry from the theme's `tooltip_compact`
// cells.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Tooltip, {
      label: props.label,
      align: props.align,
      defaultOpen: props.defaultOpen === true,
      enterDelayMs: props.enterDelayMs,
      leaveDelayMs: props.leaveDelayMs,
      // The compact tooltip is the same component under the icon-tooltip
      // container class - what the upstream icon button applies around its label
      className: props.compact === true ? 'cds--icon-tooltip' : undefined
    // The trigger is a focusable control drawn like the text anchor our
    // side wraps a string child in - the theme's own default type and ink,
    // read from the template tokens; only the popover is the compared subject
    }, React.createElement('button', {
      type: 'button',
      style: (function () {
        const type = upstream.tokens['type.body_compact_02'];
        return {
          appearance: 'none',
          background: 'none',
          border: 'none',
          color: upstream.tokens['color.text_primary'],
          cursor: 'default',
          fontFamily: String(upstream.tokens['font.family.' + type.fontFamily] || type.fontFamily),
          fontSize: String(type.fontSize) + 'px',
          fontWeight: String(type.fontWeight),
          letterSpacing: String(type.letterSpacing) + 'px',
          lineHeight: String(type.lineHeight) + 'px',
          margin: 0,
          padding: 0,
          textAlign: 'left',
          verticalAlign: 'top'
        };
      })()
    }, typeof props.children === 'string' ? props.children : 'Anchor'));
  },
  // The element a person hovers and focuses: the trigger the tooltip wraps
  target: Object.freeze({ upstream: '.cds--tooltip-trigger__wrapper > *', ours: '[aria-describedby] > *' }),
  parts: Object.freeze({
    bubble: Object.freeze({ upstream: '.cds--popover-content', ours: '[role="tooltip"] > div', measure: 'box', optional: true, compare: ['width', 'backgroundColor', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'borderTopLeftRadius'] }),
    label: Object.freeze({ upstream: '.cds--popover-content', ours: '[role="tooltip"] [dir="auto"]', measure: 'text', optional: true, compare: ['color', 'fontFamily', 'fontSize', 'fontWeight', 'height', 'lineHeight', 'letterSpacing', 'width'] }),
    // Every pixel a sampler can pick in the small caret triangle is an
    // anti-aliased edge pixel, so its sampled paint flakes between runs; the
    // caret's own color is still compared as a property, as with the Modal
    // scrim
    caret: Object.freeze({ upstream: '.cds--popover-caret', ours: '[role="tooltip"] [aria-hidden="true"]', measure: 'box', optional: true, compare: ['width', 'height'], except: ['paint'] }),
    // The caret's fill paints a different element on each side: upstream
    // clips the `::after` of its caret element into the triangle, ours is
    // the rotated square inside the clipping box, so the color compare has
    // to read the painted element on both. The upstream element is
    // `display: none` while a mounted popover sits closed, which a pseudo
    // still measures as drawn, so the selector names the open popover
    caretFill: Object.freeze({ upstream: '.cds--popover[aria-hidden="false"] .cds--popover-caret', pseudo: '::after', ours: '[role="tooltip"] [aria-hidden="true"] > *', measure: 'box', optional: true, compare: ['backgroundColor'], except: ['paint'] })
  })
});
