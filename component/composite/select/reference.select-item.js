// Info: SelectItem's reference mounts. The primary reference draws a native
// option only inside its own select, so primary `mount` returns null; the
// second reference's `md-select-option` is measured under the material
// template for box and label.

export default Object.freeze({
  kind: 'render-web',
  mount: function () {
    return null;
  },
  body: Object.freeze({ width: 320 }),
  parts: Object.freeze({}),
  second: Object.freeze({
    mount: function (React, upstream, props) {
      if (props.value === 'long') {
        return null;
      }
      return React.createElement('md-select-option', {
        value: props.value,
        selected: props.selected === true ? true : undefined,
        disabled: props.disabled === true ? true : undefined
      }, React.createElement('div', { slot: 'headline' }, props.label));
    },
    body: Object.freeze({ width: 320 }),
    parts: Object.freeze({
      item: Object.freeze({ upstream: 'md-select-option >>> li.list-item', ours: '[role="option"]', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      label: Object.freeze({ upstream: 'md-select-option > [slot="headline"]', ours: '[role="option"] [dir="auto"]', measure: 'text' })
    })
  })
});
