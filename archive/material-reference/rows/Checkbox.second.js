// Info: component/molecule/checkbox/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'box',
    mount: function (React, upstream, props) {
      if (props.invalid === true) {
        return null;
      }
      return React.createElement('md-checkbox', {
        checked: props.checked === true,
        indeterminate: props.indeterminate === true,
        disabled: props.disabled === true
      });
    },
    target: Object.freeze({ upstream: 'md-checkbox', ours: '[role="checkbox"]' }),
    parts: Object.freeze({
      box: Object.freeze({ upstream: 'md-checkbox >>> .container', ours: 'div:has(> [role="checkbox"]) > div:nth-child(1) > div:nth-child(1)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      outline: Object.freeze({ upstream: 'md-checkbox >>> .container.unselected > .outline', ours: 'div:has(> [role="checkbox"][aria-checked="false"]) > div:nth-child(1) > div:nth-child(1)', measure: 'box', compare: ['borderTopWidth', 'borderBottomWidth', 'borderBottomColor', 'backgroundColor'] }),
      fill: Object.freeze({ upstream: 'md-checkbox >>> .container.selected > .background', ours: 'div:has(> [role="checkbox"]:not([aria-checked="false"])) > div:nth-child(1) > div:nth-child(1)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius', 'backgroundColor'] })
    }),
    // The second reference's checkbox is the box alone: the page pairs it with its own label,
    // wrapper and messages, so nothing of those is drawn beside it
    omit: Object.freeze({
      root: Object.freeze({ reason: 'the second reference draws no wrapper around the box', upstream: '*:has(> md-checkbox)' }),
      label: Object.freeze({ reason: 'the second reference draws no label; the page supplies one', upstream: 'md-checkbox ~ *, md-checkbox >>> label' }),
      message: Object.freeze({ reason: 'the second reference draws no helper or error text', upstream: 'md-checkbox ~ *, md-checkbox >>> .supporting-text' }),
      messageIcon: Object.freeze({ reason: 'the second reference has no invalid state with an icon (an invalid sample is not mounted there)', upstream: 'md-checkbox ~ * svg' })
    })
  });
