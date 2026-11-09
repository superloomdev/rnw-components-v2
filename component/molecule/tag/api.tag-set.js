// Info: TagSet public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'TagSet',
  props: Object.freeze({
    tags: { type: 'array', required: true, description: '`{ label, type?, onClose? }` entries: a `Tag` of that type, or a `DismissibleTag` when `onClose` is given.' },
    align: { type: 'string', required: false, description: 'Row alignment: `start` (default), `center`, `end`.' },
    multiline: { type: 'boolean', required: false, description: 'Wraps every tag with no overflow control.' },
    maxVisible: { type: 'number', required: false, description: 'Caps how many tags the row may show.' },
    overflowType: { type: 'string', required: false, description: '`default` lists hidden tags as rows; `tag` draws them as high-contrast tags.' },
    showAllTagsLabel: { type: 'string', required: false, description: 'The link that opens the all-tags dialog past ten hidden tags. Default `View all tags`.' },
    allTagsModalTitle: { type: 'string', required: false, description: 'The dialog\'s title. Default `All tags`.' },
    allTagsModalSearchLabel: { type: 'string', required: false, description: 'The dialog search field\'s label. Default `Search all tags`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  composition: Object.freeze({}),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tag_set_gap', 'color.tooltip_label',
    'color.link_label_inverse', 'color.link_label_inverse_hover', 'color.focus_ring_inverse',
    'spacing.spacing_05', 'type.body_compact_01', 'stacking.floating'
  ]),
  colors: Object.freeze([])
});
