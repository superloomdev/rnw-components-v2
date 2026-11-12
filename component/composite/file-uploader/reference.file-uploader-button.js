// Info: FileUploaderButton measurement reference. Upstream takes the same
// props and draws a Button-classed button beside a hidden label and file
// input. The part compared is the button.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.FileUploaderButton, {
      buttonKind: props.buttonKind,
      disabled: props.disabled === true,
      labelText: props.labelText,
      size: props.size
    });
  },
  target: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"]' }),
  parts: Object.freeze({
    button: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"]', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"] [dir="auto"]', measure: 'text' })
  })
});
