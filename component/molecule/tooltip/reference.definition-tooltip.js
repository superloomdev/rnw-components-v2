// Info: DefinitionTooltip measurement reference. The upstream term is a
// button with the dotted underline; its bubble is the inverse popover
// content, mounted while open. Ours mounts the bubble only while open, so
// the bubble parts are `optional` and measured through the press
// interaction or a `defaultOpen` mount. The second reference is `none`.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['pressed']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.DefinitionTooltip, {
      align: props.align,
      autoAlign: props.autoAlign === true,
      defaultOpen: props.defaultOpen === true,
      definition: props.definition,
      openOnHover: props.openOnHover === true
    }, props.children);
  },
  target: Object.freeze({ upstream: '.cds--definition-term', ours: '[aria-expanded]' }),
  parts: Object.freeze({
    term: Object.freeze({ upstream: '.cds--definition-term', ours: '[aria-expanded]', measure: 'box' }),
    underline: Object.freeze({ upstream: '.cds--definition-term', ours: '[aria-expanded]', measure: 'box', compare: ['borderBottomColor', 'borderBottomWidth', 'borderBottomStyle'] }),
    bubble: Object.freeze({ upstream: '.cds--popover-content', ours: 'div[style*="max-width"] > div:not([aria-hidden])', optional: true })
  })
});
