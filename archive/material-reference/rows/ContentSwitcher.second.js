// Info: component/composite/tabs/reference.content-switcher.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'container',
    mount: function (React, upstream, props) {
      const items = Array.isArray(props.items) ? props.items : [];
      return React.createElement('md-outlined-segmented-button-set', null,
        items.map(function (item, index) {
          return React.createElement('md-outlined-segmented-button', {
            key: index,
            selected: index === (props.defaultSelectedIndex || 0) ? true : undefined,
            disabled: item.disabled === true ? true : undefined,
            label: item.text || item.label
          });
        }));
    },
    parts: Object.freeze({
      container: Object.freeze({ upstream: 'md-outlined-segmented-button-set', ours: '[role="tablist"]', measure: 'box', compare: ['x', 'y', 'backgroundColor'] }),
      segment: Object.freeze({ upstream: 'md-outlined-segmented-button', ours: '[role="tab"]', measure: 'box', compare: ['x', 'y', 'backgroundColor'] })
    })
  });
