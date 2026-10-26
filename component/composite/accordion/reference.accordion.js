// Info: Accordion's measurement reference. The upstream Accordion takes the
// same align/size/disabled/isFlush/ordered flags and the same items; its
// heading is a button inside the first item. `body` fixes the cell width the
// showcase measures.

export default Object.freeze({
  kind: 'render-web',
  body: { width: 320 },
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Accordion, {
      align: props.align,
      size: props.size,
      disabled: props.disabled,
      isFlush: props.isFlush === true,
      ordered: props.ordered === true
    }, (props.items || []).map(function (item) {
      return React.createElement(upstream.AccordionItem, {
        key: item.title,
        title: item.title,
        open: item.open === true,
        disabled: item.disabled === true
      }, React.createElement('p', { style: upstream.fixtureTextStyle('bodyCompact01') }, item.children));
    }));
  },
  target: Object.freeze({ upstream: '.cds--accordion__item:nth-child(1) .cds--accordion__heading', ours: '[role="listitem"]:nth-child(1) [role="button"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--accordion', ours: '[role="list"]', measure: 'box' }),
    item: Object.freeze({ upstream: '.cds--accordion__item:nth-child(1)', ours: '[role="listitem"]:nth-child(1)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderTopColor'] }),
    lastItem: Object.freeze({ upstream: '.cds--accordion__item:last-child', ours: '[role="listitem"]:last-child', measure: 'box', compare: ['borderBottomWidth', 'borderBottomColor'] }),
    heading: Object.freeze({ upstream: '.cds--accordion__item:nth-child(1) .cds--accordion__heading', ours: '[role="listitem"]:nth-child(1) [role="button"]', measure: 'box' }),
    arrow: Object.freeze({ upstream: '.cds--accordion__item:nth-child(1) .cds--accordion__arrow path', ours: '[role="listitem"]:nth-child(1) svg path', measure: 'box' }),
    title: Object.freeze({ upstream: '.cds--accordion__item:nth-child(1) .cds--accordion__title', ours: '[role="listitem"]:nth-child(1) [role="button"] [dir="auto"]', measure: 'text' }),
    content: Object.freeze({ upstream: '.cds--accordion__item:nth-child(2) .cds--accordion__content', ours: '[role="listitem"]:nth-child(2) [role="region"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'], optional: true })
  })
});
