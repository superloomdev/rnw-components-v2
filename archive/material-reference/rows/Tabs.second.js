// Info: component/composite/tabs/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'bar',
    mount: function (React, upstream, props) {
      if (props.variant === 'contained') {
        return null;
      }
      const items = Array.isArray(props.items) ? props.items : [];
      return React.createElement('md-tabs', {
        'aria-label': props.accessibilityLabel || 'Sections'
      }, items.map(function (item, index) {
        return React.createElement('md-primary-tab', {
          key: index,
          active: index === (props.defaultSelectedIndex || 0) ? true : undefined,
          'aria-disabled': item.disabled === true ? true : undefined,
          // The page loads no upstream typescale, so the label's tracking
          // falls back to normal; the mount restores the label-large value
          style: { letterSpacing: 0.1 }
        }, item.label);
      }));
    },
    parts: Object.freeze({
      // The upstream host is a flex column of `.tabs` plus the md-divider,
      // matching our bar's tab strip plus bottom border; its line is the
      // `divider` part's, so no border property compares here
      bar: Object.freeze({ upstream: 'md-tabs', ours: '[role="tablist"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius', 'backgroundColor'] }),
      tab: Object.freeze({ upstream: 'md-primary-tab', ours: '[role="tab"]:first-of-type', measure: 'box' }),
      label: Object.freeze({ upstream: 'md-primary-tab[active]', ours: '[role="tab"][aria-selected="true"] [dir="auto"]', measure: 'text' }),
      indicator: Object.freeze({ upstream: 'md-primary-tab[active] >>> .indicator', ours: '[role="tab"][aria-selected="true"] > div:nth-of-type(3) > [aria-hidden="true"]', measure: 'box', compare: ['x', 'width', 'height', 'backgroundColor', 'borderTopLeftRadius'] }),
      // The upstream divider draws its line on a `::before` inside the
      // md-divider child; ours is the tablist's own bottom edge, read as a strip
      divider: Object.freeze({ upstream: 'md-tabs >>> md-divider', pseudo: '::before', ours: '[role="tablist"]', oursStrip: 'borderBottom', measure: 'box', compare: ['y', 'width', 'height', 'backgroundColor'] })
    })
  });
