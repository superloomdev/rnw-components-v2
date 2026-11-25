// Info: TagSet measurement reference. The upstream TagSet comes from the
// package the roster row names; the harness mounts it with the
// same tags and frame width. Parts compare the row's gap and the overflow
// tag's seat. The second reference is `none`. The `allTags` state also
// mounts the package's own all-tags dialog open (it opens on a press
// upstream): a fixed layer the injected rule pins to the staged cell, as
// ComposedModal's reference does; ours renders hosted in the same cell.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320, height: 560, stage: true }),
  oursHosted: true,
  mount: function (React, upstream, props) {
    const set = React.createElement(upstream.TagSet, {
      allTagsModalSearchLabel: props.allTagsModalSearchLabel,
      allTagsModalTitle: props.allTagsModalTitle,
      maxVisible: props.maxVisible,
      multiline: props.multiline === true,
      overflowAlign: 'bottom',
      overflowType: props.overflowType,
      showAllTagsLabel: props.showAllTagsLabel,
      tags: props.tags
    });
    if (props.defaultAllTagsOpen !== true) {
      return set;
    }
    // The package portals the dialog to the document's body unless given a
    // target: the holder hands it its own node, inside the staged cell
    const Holder = function () {
      const [node, setNode] = React.useState(null);
      return React.createElement('div', { ref: setNode, style: { inset: 0, position: 'absolute' } }, node === null ? null : React.createElement(upstream.TagSetModal, {
        allTags: props.tags,
        onClose: function () {
          return false;
        },
        open: true,
        portalTarget: node,
        searchLabel: props.allTagsModalSearchLabel || 'Search all tags',
        title: props.allTagsModalTitle || 'All tags'
      }));
    };
    return React.createElement('div', { style: { height: 560, position: 'relative', transform: 'scale(1)', width: 320 } },
      React.createElement('style', null, '.cds--modal { position: absolute !important; inset: 0 !important; inline-size: 100% !important; block-size: 100% !important; width: 100% !important; height: 100% !important; }'),
      set,
      React.createElement(Holder));
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.c4p--tag-set', ours: ':scope > div', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
    firstTag: Object.freeze({ upstream: '.c4p--tag-set__tag-container:not(.c4p--tag-set__tag-container--hidden) .cds--tag', ours: '[data-testid="tag"]', measure: 'box' }),
    overflow: Object.freeze({ upstream: '.c4p--tag-set-overflow:not(.c4p--tag-set-overflow--hidden) .cds--tag', ours: 'div:has(> [role="button"]) > [data-testid="tag"]', measure: 'box', optional: true }),
    // The all-tags dialog's box and its scrolling body (`_tag-set.scss:89-94`)
    dialog: Object.freeze({ upstream: '.c4p--tag-set-modal__container', ours: '[role="dialog"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] }),
    dialogBody: Object.freeze({ upstream: '.c4p--tag-set-modal__body', ours: '[role="dialog"] [data-part="modalBody"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] }),
    overflowLabel: Object.freeze({ upstream: '.c4p--tag-set-overflow:not(.c4p--tag-set-overflow--hidden) .cds--tag__label', ours: 'div:has(> [role="button"]) [dir="auto"]', measure: 'text', optional: true })
  })
});
