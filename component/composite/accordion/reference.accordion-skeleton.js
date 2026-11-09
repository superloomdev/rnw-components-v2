// Info: AccordionSkeleton's measurement reference. The upstream
// AccordionSkeleton mounts with the same count/open/align/isFlush/ordered
// flags; the title and content bars read the upstream skeleton-text rows.

export default Object.freeze({
  kind: 'render-web',
  body: { width: 320 },
  mount: function (React, upstream, props) {
    return React.createElement(upstream.AccordionSkeleton, {
      count: props.count,
      open: props.open !== false,
      align: props.align,
      isFlush: props.isFlush === true,
      ordered: props.ordered === true
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--accordion', ours: '[role="list"]', measure: 'box' }),
    openItem: Object.freeze({ upstream: '.cds--accordion__item:nth-child(1)', ours: '[role="listitem"]:nth-child(1)', measure: 'box' }),
    heading: Object.freeze({ upstream: '.cds--accordion__item:nth-child(1) .cds--accordion__heading', ours: '[role="listitem"]:nth-child(1) > div', measure: 'box' }),
    arrow: Object.freeze({ upstream: '.cds--accordion__item:nth-child(1) .cds--accordion__arrow path', ours: '[role="listitem"]:nth-child(1) svg path', measure: 'box' }),
    titleBar: Object.freeze({ upstream: '.cds--accordion__item:nth-child(1) .cds--accordion__title', ours: '[role="listitem"]:nth-child(1) div[aria-hidden="true"]', measure: 'box' }),
    contentBars: Object.freeze({ upstream: '.cds--accordion__item:nth-child(1) .cds--accordion__content .cds--skeleton__text', ours: '[role="listitem"]:nth-child(1) [role="region"] div[aria-hidden="true"]', measure: 'box', optional: true, all: true })
  })
});
