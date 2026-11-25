// Info: TagSet sample states. Each label renders the Showcase cell.

// A stage, so the all-tags dialog's layer covers the cell: 560 tall, the
// dialog's 90 % (504) past its 450 cap from md (`_tag-set.scss:89-94`)
export const FRAME = Object.freeze({ width: 320, height: 560, stage: true });

export default Object.freeze([
  { label: 'fits', props: { tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }] } },
  { label: 'overflow', props: { maxVisible: 2, tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }, { label: 'Four' }, { label: 'Five' }, { label: 'Six' }, { label: 'Seven' }, { label: 'Eight' }] } },
  { label: 'max-visible', props: { maxVisible: 2, tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }] } },
  { label: 'multiline', props: { multiline: true, tags: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }, { label: 'Four' }, { label: 'Five' }, { label: 'Six' }] } },
  { label: 'many', props: { maxVisible: 2, tags: Array.from({ length: 14 }, function (_, i) {
    return { label: 'Tag ' + (i + 1) };
  }) } },
  { label: 'dismissible', props: { maxVisible: 2, tags: [{ label: 'One', onClose: function () {} }, { label: 'Two' }] } },
  // The all-tags dialog open, its body taller than its room so it scrolls
  { label: 'allTags', props: { defaultAllTagsOpen: true, maxVisible: 2, tags: Array.from({ length: 40 }, function (_, i) {
    return { label: 'Tag ' + (i + 1) };
  }) } }
]);
