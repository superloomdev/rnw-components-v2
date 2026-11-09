// Info: Popover measurement reference. The upstream popover mounts its
// content span while open with the caret span inside; the compared parts are
// the bubble's fill, radius, shadow and the caret's clipped box, not its
// absolute coordinates. The second reference is `none`.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Popover, {
      align: props.align,
      autoAlign: props.autoAlign === true,
      border: props.border === true,
      caret: props.caret !== false,
      dropShadow: props.dropShadow !== false,
      highContrast: props.highContrast === true,
      open: props.open === true
    },
    React.createElement('button', {
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
    }, 'Anchor'),
    React.createElement(upstream.PopoverContent, null, props.content));
  },
  parts: Object.freeze({
    bubble: Object.freeze({ ours: 'div[style*="max-width"]', upstream: '.cds--popover-content', compare: ['backgroundColor', 'borderTopLeftRadius', 'borderTopWidth', 'borderTopColor', 'maxWidth', 'boxShadow', 'x', 'y', 'width', 'height'] }),
    caret: Object.freeze({ ours: 'div[aria-hidden="true"] div', upstream: '.cds--popover-caret', compare: ['backgroundColor', 'width', 'height', 'x', 'y'] })
  })
});
