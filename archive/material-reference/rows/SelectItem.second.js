// Info: component/composite/select/reference.select-item.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
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
  });
