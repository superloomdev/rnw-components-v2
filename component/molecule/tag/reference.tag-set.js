// Info: TagSet measurement reference. The upstream TagSet comes from the
// package the roster row names; the harness mounts it with the
// same tags and frame width. Parts compare the row's gap and the overflow
// tag's seat. The second reference is `none`.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.TagSet, {
      allTagsModalSearchLabel: props.allTagsModalSearchLabel,
      allTagsModalTitle: props.allTagsModalTitle,
      maxVisible: props.maxVisible,
      multiline: props.multiline === true,
      overflowAlign: 'bottom',
      overflowType: props.overflowType,
      showAllTagsLabel: props.showAllTagsLabel,
      tags: props.tags
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.c4p--tag-set', ours: ':scope > div', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
    firstTag: Object.freeze({ upstream: '.c4p--tag-set__tag-container:not(.c4p--tag-set__tag-container--hidden) .cds--tag', ours: '[data-testid="tag"]', measure: 'box' }),
    overflow: Object.freeze({ upstream: '.c4p--tag-set-overflow:not(.c4p--tag-set-overflow--hidden) .cds--tag', ours: 'div:has(> [role="button"]) > [data-testid="tag"]', measure: 'box', optional: true }),
    overflowLabel: Object.freeze({ upstream: '.c4p--tag-set-overflow:not(.c4p--tag-set-overflow--hidden) .cds--tag__label', ours: 'div:has(> [role="button"]) [dir="auto"]', measure: 'text', optional: true })
  })
});
