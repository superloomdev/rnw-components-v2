// Info: SelectableTag measurement reference. The primary's selectable tag
// takes `text`, `selected`, `size`, `disabled` and `renderIcon`; it renders
// as a pressed-announced button and the button is the target. The second
// reference was retired (batch R).

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SelectableTag, {
      text: props.text,
      selected: props.selected === true,
      size: props.size,
      disabled: props.disabled === true,
      renderIcon: props.icon ? upstream.icon(props.icon) : undefined,
      onClick: function () {}
    });
  },
  target: Object.freeze({ upstream: '.cds--tag--selectable', ours: '[role="button"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tag--selectable', ours: ':scope > div > div', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--tag__label', ours: ':scope > div > div > div > [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: '.cds--tag__custom-icon svg', ours: ':scope > div > div > div > svg', measure: 'box', optional: true })
  })
});
