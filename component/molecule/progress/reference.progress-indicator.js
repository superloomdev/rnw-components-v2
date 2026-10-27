// Info: ProgressIndicator measurement reference. The indicator is an
// unordered list of `ProgressStep` children cloned with the index state;
// the samples carry the steps as `items` entries, which this mounts as
// real `ProgressStep` children on the primary. The parts compared are
// the list root and its steps - each step's own parts are ProgressStep's
// reference. There is no second reference: the second system has no
// progress indicator, so its values are a Superloom decision.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement(upstream.ProgressIndicator, {
      currentIndex: props.currentIndex,
      onChange: props.onChange,
      spaceEqually: props.spaceEqually,
      vertical: props.vertical
    }, items.map(function (item, index) {
      return React.createElement(upstream.ProgressStep, Object.assign({ key: index }, item));
    }));
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--progress', ours: ':scope > ul', measure: 'box' }),
    first: Object.freeze({ upstream: '.cds--progress-step:nth-child(1)', ours: ':scope > ul > li:nth-child(1)', measure: 'box' }),
    third: Object.freeze({ upstream: '.cds--progress-step:nth-child(3)', ours: ':scope > ul > li:nth-child(3)', measure: 'box' })
  })
});
